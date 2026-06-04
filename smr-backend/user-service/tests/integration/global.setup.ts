import { GenericContainer, StartedTestContainer } from "testcontainers";

let mongoTestContainer: StartedTestContainer;
let rabbitMqTestContainer: StartedTestContainer;
let redisTestContainer: StartedTestContainer;

export default async function () {
  const [mongo, rabbitmq, redis] = await Promise.all([
    new GenericContainer("mongo:7.0").withExposedPorts(27017).start(),
    new GenericContainer("rabbitmq").withExposedPorts(5672).start(),
    new GenericContainer("redis:7.0").withExposedPorts(6379).start(),
  ]);

  mongoTestContainer = mongo;
  rabbitMqTestContainer = rabbitmq;
  redisTestContainer = redis;

  const mongoDBHost = mongoTestContainer.getHost();
  const mongoDBPort = mongoTestContainer.getMappedPort(27017);

  process.env.MONGO_TEST_URI = `mongodb://${mongoDBHost}:${mongoDBPort}/test_db`;
  console.log(`MongoDB test container running: ${process.env.MONGO_TEST_URI}`);

  process.env.RABBITMQ_TEST_URI = `amqp://${rabbitMqTestContainer.getHost()}:${rabbitMqTestContainer.getMappedPort(5672)}`;
  console.log(
    `RabbitMQ test container running: ${process.env.RABBITMQ_TEST_URI}`,
  );

  process.env.REDIS_TEST_URL = `redis://${redisTestContainer.getHost()}:${redisTestContainer.getMappedPort(6379)}`;
  console.log(`Redis test container running: ${process.env.REDIS_TEST_URL}`);

  //cleanup function for vitest
  return async function () {
    console.log("Stopping test containers");
    await Promise.all([
      mongoTestContainer.stop(),
      rabbitMqTestContainer.stop(),
      redisTestContainer.stop(),
    ]);
    console.log("Test containers stopped.");
  };
}
