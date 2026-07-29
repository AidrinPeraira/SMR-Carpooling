import { IEventBus } from "#/application/interfaces/services/IEventBus";
import { DomainEvent, ILogger } from "@sharemyride/shared";
import amqp from "amqplib";

type AmqpConnection = Awaited<ReturnType<typeof amqp.connect>>;
type AmqpChannel = Awaited<ReturnType<AmqpConnection["createChannel"]>>;

/**
 * Implementation of IEventBus using RabbitMQ.
 * Manages connections, topology (Exchanges, DLX, DLQ), and event publishing.
 */
export class RabbitMQEventBus implements IEventBus {
  private _connection: AmqpConnection | null;
  private _channel: AmqpChannel | null;
  private readonly _logger: ILogger;
  private readonly _url: string;
  private readonly _exchangeName: string;

  //adding dead letter
  private readonly _dlxName: string;
  private readonly _dlqName: string;

  constructor(
    logger: ILogger,
    url: string,
    exchangeName: string = "sharemyride.events",
  ) {
    this._logger = logger;
    this._url = url;
    this._exchangeName = exchangeName;
    this._connection = null;
    this._channel = null;

    this._dlqName = `${exchangeName}.dlx`;
    this._dlxName = `${exchangeName}.dlq`;
  }

  /**
   * This method establishes a connection to the rabbit mq server.
   * It creates a channel and exhange right after.
   * It reties on failure to connect and sents event listner to try reconnect on connection close
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

      //create a queuw for deal letters in the dl exchange
      await this._channel.assertQueue(this._dlqName, {
        durable: true,
      });

      //bind failed messages to the dead letter queue
      await this._channel.bindQueue(this._dlqName, this._dlxName, "#"); // "#" is used to catch all events irrespective of the routing key.

      this._logger.info("Rabbit MQ exchange and dead letter aasserted.");
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
}
