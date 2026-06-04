import { RabbitMQEventBus } from "#/infrastructure/services/RabbitMQEventBus";
import { beforeAll, describe, expect, it } from "vitest";
import { MockLogger } from "../../mocks/MockLogger";
import { mockEvent } from "../../fixtures/events/DomainEvents";

describe("RabbitMQ EventBus Integration", () => {
  let eventBus: RabbitMQEventBus;

  beforeAll(async () => {
    const url = process.env.RABBITMQ_TEST_URI;

    if (!url) {
      throw new Error("RabbitMQ test rui not found in environment.");
    }

    const logger = new MockLogger();
    eventBus = new RabbitMQEventBus(logger, url);
    await eventBus.connect();
  });

  it("should successfullt connect to RabbitMQ", () => {
    //only if the connection is successful will this run. so this is a dummy test case
    expect(true).toBe(true);
  });

  it("should publish and event to the exchange", async () => {
    const testEvent = mockEvent;

    await expect(eventBus.publish(testEvent)).resolves.not.toThrow();
  });
});
