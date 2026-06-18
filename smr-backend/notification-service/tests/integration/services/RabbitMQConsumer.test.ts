import { beforeAll, afterAll, describe, expect, it, vi } from "vitest";
import { RabbitMQConsumer } from "#/infrastructure/services/RabbitMQConsumer";
import { EventName } from "@smr/shared";
import { MockLogger } from "&#/mocks/MockLogger";
import { MockEventDispatcher } from "&#/mocks/MockEventDispatcher";
import { mockUserSignUpEvent } from "&#/fixtures/events/DomainEvents";
import amqp from "amqplib";

describe("RabbitMQConsumer Integration Test", () => {
  let connection: Awaited<ReturnType<typeof amqp.connect>>;
  let channel: Awaited<ReturnType<(typeof connection)["createChannel"]>>;
  let consumer: RabbitMQConsumer;

  beforeAll(async () => {
    const url = process.env.RABBITMQ_TEST_URI;
    if (!url) {
      throw new Error("RABBITMQ_TEST_URI not set");
    }
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
  });

  afterAll(async () => {
    await channel.close();
    await connection.close();
    await consumer["_connection"]?.close();
  });

  it("should consume published auth.user.signup event from RabbitMQ", async () => {
    const url = process.env.RABBITMQ_TEST_URI!;
    let resolveDispatch: (value: any) => void;
    const dispatchCalled = new Promise((resolve) => {
      resolveDispatch = resolve;
    });

    const dispatcher = new MockEventDispatcher();
    vi.mocked(dispatcher.dispatch).mockImplementation((event) => {
      resolveDispatch(event);
      return Promise.resolve();
    });

    const logger = new MockLogger();
    consumer = new RabbitMQConsumer(
      logger,
      url,
      dispatcher,
      "test.events",
      "test.notifications.queue",
    );

    await consumer.connect();

    channel.publish(
      "test.events",
      EventName.AUTH_USER_SIGNUP,
      Buffer.from(JSON.stringify(mockUserSignUpEvent)),
    );

    const receivedEvent = (await dispatchCalled) as typeof mockUserSignUpEvent;

    expect(receivedEvent.eventName).toBe(mockUserSignUpEvent.eventName);
    expect(receivedEvent.payload.emailId).toBe(
      mockUserSignUpEvent.payload.emailId,
    );
  });
});
