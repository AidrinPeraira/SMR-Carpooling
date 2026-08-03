import { IEventBus } from "#/application/interfaces/messaging/IEventBus";
import { IEventDispatcher } from "#/application/interfaces/messaging/IEventDispatcher";
import { DomainEvent, EventName, ILogger } from "@sharemyride/shared";
import amqp from "amqplib";

type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;
type AmqpChannel = Awaited<ReturnType<AmqpConnection["createChannel"]>>;

/**
 * This is the implementaition for the message broker. It handles broker connection and pub-sub of events
 */
export class EventBus implements IEventBus {
  private _connection: AmqpConnection | null;
  private _channel: AmqpChannel | null;
  private readonly _logger: ILogger;
  private readonly _url: string;
  private readonly _exchangeName: string;

  //adding dead letter
  private readonly _dlxName: string;
  private readonly _dlqName: string;

  //consuming
  private _isConsuming: boolean = false;
  private readonly _eventDispatcher: IEventDispatcher;
  private readonly _queueName: string;

  constructor(
    logger: ILogger,
    url: string,
    exchangeName: string = "sharemyride.events",
    eventDispatcher: IEventDispatcher,
    queueName: string = "smr.trips.queue",
  ) {
    this._logger = logger;
    this._url = url;
    this._exchangeName = exchangeName;
    this._connection = null;
    this._channel = null;

    this._dlqName = `${exchangeName}.dlx`;
    this._dlxName = `${exchangeName}.dlq`;

    this._queueName = queueName;
    this._eventDispatcher = eventDispatcher;
  }

  /**
   * This method establishes a connection to the rabbit mq server.
   * It creates a channel and exchange right after.
   * It retries on failure to connect and sets event listener to try reconnect on connection close.
   */
  async connect(): Promise<void> {
    try {
      //create connection, channel and exchange
      this._logger.info("Connecting to RabbitMQ");
      this._connection = await amqp.connect(this._url);
      this._channel = await this._connection.createChannel();
      this._logger.info("Rabbit MQ connected.");

      //log any errors in connection
      this._connection.on("error", (error) => {
        this._logger.error("Rabbit MQ connection error: ", error);
      });

      //retry on connection termination (while working)
      this._connection.on("close", () => {
        this._logger.info("RabbitMQ connection closed. Retrying.");
        setTimeout(async () => {
          await this.connect();
        }, 5000);
      });

      //create main exchange
      await this._channel.assertExchange(this._exchangeName, "topic", {
        durable: true,
      });

      //create dead letter exchange
      await this._channel.assertExchange(this._dlxName, "topic", {
        durable: true,
      });

      //create a queue for dead letters in the dl exchange
      await this._channel.assertQueue(this._dlqName, {
        durable: true,
      });

      //bind failed messages to the dead letter queue
      await this._channel.bindQueue(this._dlqName, this._dlxName, "#"); // "#" is used to catch all events irrespective of the routing key.

      this._logger.info("Rabbit MQ exchange and dead letter asserted.");

      await this.subscribe([EventName.ADMIN_APPROVE_APPLICTION]);

      this._logger.info("RabbitMQ initialised successfully");
      await this.consume();
    } catch (error: unknown) {
      //retrying on failure to connect
      this._logger.info("RabbitMQ connection failed!", error);
      this._logger.info("Retrying connection to RabbitMQ");
      setTimeout(async () => {
        await this.connect();
      }, 5000);
    }
  }

  /**
   * Asserts the service queue and binds it to specified event routing keys on the exchange.
   *
   * @param eventsToListenTo - List of event routing keys to subscribe to.
   */
  async subscribe(eventsToListenTo: EventName[] = []): Promise<void> {
    if (!this._channel) {
      this._logger.error(
        "RabbitMQ channel not initialised. Cannot subscribe to queues",
      );
      return;
    }

    try {
      //bind a queue for the current trip service
      await this._channel.assertQueue(this._queueName, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": this._dlxName, //for failed messages
        },
      });

      //Binding the routing keys for consumer queue
      for (const routingKey of eventsToListenTo) {
        await this._channel.bindQueue(
          this._queueName,
          this._exchangeName,
          routingKey,
        );
        this._logger.info("Bound consumer queue for routing key: ", routingKey);
      }
    } catch (error: unknown) {
      this._logger.error("Error subscribing queue to events: ", error);
      throw error;
    }
  }

  /**
   * This method takes the domain event object, with the payload and
   * publishes an event to the message broker queue. It uses the event
   * name as the routing key.
   *
   * @param event : Domain event with name and payload and other meta data
   */
  async publish<EventPayloadType>(
    event: DomainEvent<EventPayloadType>,
  ): Promise<void> {
    try {
      //check for active connection
      if (!this._channel) {
        this._logger.warn(
          "Rabbit MQ channel not ready. Droping event: ",
          event,
        );
        return;
      }

      const routingKey = event.eventName;
      const wasPublished = this._channel.publish(
        this._exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(event)),
        {
          persistent: true,
          timestamp: Date.now(),
        },
      );

      if (wasPublished) {
        this._logger.info("Event published: ", {
          eventName: event.eventName,
        });
      } else {
        this._logger.warn("Failed to publish event: ", {
          eventName: event.eventName,
        });
      }
    } catch (error: unknown) {
      this._logger.error("Error publishing event: ", {
        eventName: event.eventName,
      });
      throw error;
    }
  }

  /**
   * Starts consuming messages from the queue and dispatches events to registered handlers.
   */
  async consume(): Promise<void> {
    if (!this._channel) {
      this._logger.error(
        "RabbitMQ channel not initialised. Cannot start consumption",
      );
      return;
    }

    if (this._isConsuming) {
      this._logger.info("Consumer already running. Skipping duplicate attempt");
      return;
    }

    try {
      await this._channel.prefetch(1); //settings to consume 1 event at a time

      this._logger.info("Subscribing consumer to queue: ", this._queueName);
      this._isConsuming = true;

      await this._channel.consume(this._queueName, async (message) => {
        //this method is called when a message is received

        if (!message) {
          this._logger.warn("Consumer was cancelled by RabbitMQ server.");
          return;
        }

        if (message == null) {
          //if the rabbit mq server closes the connection it will not throw error
          //so we need a retry mechanism

          this._logger.warn("Consumer cancelled by server. Forcing reconnect.");
          await this._connection?.close();
          //we force close the connection. This will trigger the on close listener and try again
        }

        try {
          //parse the message and call the dispatcher

          const content = message.content.toString();
          const event = JSON.parse(content) as DomainEvent<unknown>;

          this._logger.info("Event received: ", event.eventName);

          await this._eventDispatcher.dispatch(event);

          this._channel?.ack(message);
        } catch (error) {
          this._logger.error("Error processing message. Moving to DLQ", error);
          this._isConsuming = false;
          this._channel?.nack(message, false, false);
          //the not acknowledged response to rabbit mq will requeue the event into the deadletter
        }
      });
    } catch (error: unknown) {
      this._logger.error("Error in consuming events: ", error);
      throw error;
    }
  }
}
