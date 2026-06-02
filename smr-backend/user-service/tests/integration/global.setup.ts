import { GenericContainer, StartedTestContainer } from "testcontainers";

let mongoTestContainer: StartedTestContainer;
let rabbitMqTestContainer: StartedTestContainer;

export default async function () {
  mongoTestContainer = await new GenericContainer("mongo:7.0")
    .withExposedPorts(27017)
    .start();

  const mongoDBHost = mongoTestContainer.getHost();
  const mongoDBPort = mongoTestContainer.getMappedPort(27017);

  process.env.MONGO_TEST_URI = `mongodb://${mongoDBHost}:${mongoDBPort}/test_db`;
  console.log(`MongoDB test container running: ${process.env.MONGO_TEST_URI}`);

  rabbitMqTestContainer = await new GenericContainer("rabbitmq")
    .withExposedPorts(5672)
    .start();

  process.env.RABBITMQ_TEST_URI = `${rabbitMqTestContainer.getHost()}:${rabbitMqTestContainer.getMappedPort(5672)}`;

  console.log(
    `RabbitMQ test container running: ${process.env.RABBITMQ_TEST_URI}`,
  );

  //cleanup function for vitest
  return async function () {
    console.log("Stopping test containers");
    await mongoTestContainer.stop();
    await rabbitMqTestContainer.stop();
    console.log("Test containers stopped.");
  };
}

//Note: To spin up multiple containers use Promise.all() for each variable for each service. Or use a docker composer file.
