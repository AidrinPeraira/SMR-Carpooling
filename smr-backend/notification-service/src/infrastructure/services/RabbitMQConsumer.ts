import { IEventDispatcher } from "#/application/interfaces/messaging/IEventDispatcher";
import { IMessageConsumer } from "#/application/interfaces/messaging/IMessageConsumer";
import { DomainEvent, EventName, ILogger } from "@smr/shared";
import amqp from "amqplib";

type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;
type AmqpChannel = Awaited<ReturnType<AmqpConnection["createChannel"]>>;

export class RabbitMQConsumer implements IMessageConsumer {
  private _connection: AmqpConnection | null = null;
  private _channel: AmqpChannel | null = null;

  private _isConsuming: boolean = false;

  private readonly _eventDispatcher: IEventDispatcher;

  private readonly _logger: ILogger;
  private readonly _url: string;
  private readonly _exchangeName: string;

  //dead lettering
  private readonly _dlqName: string;
  private readonly _dlxName: string;

  //queue for this service
  private readonly _queueName: string;

  constructor(
    logger: ILogger,
    url: string,
    eventDispatcher: IEventDispatcher,
    exchangeName: string = "sharemyride.events",
    queueName: string = "smr.notfications.queue",
  ) {
    this._url = url;
    this._logger = logger;
    this._exchangeName = exchangeName;

    this._dlqName = `${exchangeName}.dlq`;
    this._dlxName = `${exchangeName}.dlx`;

    this._queueName = queueName;

    this._eventDispatcher = eventDispatcher;
  }

  async connect(): Promise<void> {
    try {
      //create a connection
      this._logger.info("Connecting to RabbitMQ");
      this._connection = await amqp.connect(this._url);
      this._channel = await this._connection.createChannel();
      this._logger.info("Rabbit MQ connected");

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

      this._logger.info("Asserting RabbitMQ exchanges and binding queues.");
      //create main exchange
      await this._channel.assertExchange(this._exchangeName, "topic", {
        durable: true,
      });

      //create dead letter exchange
      await this._channel.assertExchange(this._dlxName, "topic", {
        durable: true,
      });

      //create a queuw for deal letters in the dl exchange
      await this._channel.assertQueue(this._dlqName, {
        durable: true,
      });

      //bind failed messages to the dead letter queue
      await this._channel.bindQueue(this._dlqName, this._dlxName, "#"); // "#" is used to catch all events irrespective of the routing key.

      //bind a queue for the notification service
      await this._channel.assertQueue(this._queueName, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": this._dlxName, //for failed messages
        },
      });

      //Binding the routing keys for notificartion service
      const evnetsToListenTo = [
        EventName.AUTH_USER_SIGNUP,
        EventName.AUTH_USER_CHANGE_PASSWORD_REQUEST,
        EventName.AUTH_USER_CHANGE_PASSWORD_CHANGED,
      ];
      for (const routingKey of evnetsToListenTo) {
        await this._channel.bindQueue(
          this._queueName,
          this._exchangeName,
          routingKey,
        );
        this._logger.info(
          "Bounnd consumer queue for routing key: ",
          routingKey,
        );
      }

      this._logger.info("RabbitMQ initialised successfuly");

      await this.consume();
    } catch (error: unknown) {
      this._logger.error("Error in initialising RabbitMQ connection: ", error);
      setTimeout(async () => {
        this._logger.info("Retrying RabbitMQ connection");
        await this.connect();
      }, 5000);
    }
  }

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
      await this._channel.prefetch(1); //setinggs to consume 1 event at a time

      this._logger.info("Subscribing consumer to queue: ", this._queueName);
      this._isConsuming = true;

      await this._channel.consume(this._queueName, async (message) => {
        //this method is called when a message is recieved

        if (!message) {
          this._logger.warn("Consumer was cancelled by RabbitMQ server.");
          return;
        }

        if (message == null) {
          //if the rabbit mq server closes the connection it will not throw error
          //so we need a retry mechanism

          this._logger.warn("Consumer cancelled by server. Forcing reconnect.");
          await this._connection?.close();
          //we force close the connection. This will triger the on close listener and try again
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
          //the not acknowledged reponse to rabbit mq will requeue the even into the deadletter
        }
      });
    } catch (error: unknown) {
      this._logger.error("Error in consuming events: ", error);
      throw error;
    }
  }
}
