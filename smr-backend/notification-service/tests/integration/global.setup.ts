import { GenericContainer, StartedTestContainer } from "testcontainers";

let rabbitMqTestContainer: StartedTestContainer;

export default async function () {
  const rabbitmq = await new GenericContainer("rabbitmq")
    .withExposedPorts(5672)
    .start();

  rabbitMqTestContainer = rabbitmq;

  process.env.RABBITMQ_TEST_URI = `amqp://${rabbitMqTestContainer.getHost()}:${rabbitMqTestContainer.getMappedPort(5672)}`;
  console.log(
    `RabbitMQ test container running: ${process.env.RABBITMQ_TEST_URI}`,
  );

  return async function () {
    console.log("Stopping test containers");
    await rabbitMqTestContainer.stop();
    console.log("Test containers stopped.");
  };
}
