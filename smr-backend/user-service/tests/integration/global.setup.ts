import { GenericContainer, StartedTestContainer } from "testcontainers";

let mongoTestContainer: StartedTestContainer;

export default async function () {
  mongoTestContainer = await new GenericContainer("mongo:7.0")
    .withExposedPorts(27017)
    .start();

  const host = mongoTestContainer.getHost();
  const port = mongoTestContainer.getMappedPort(27017);

  process.env.MONGO_TEST_URI = `mongodb://${host}:${port}/test_db`;
  console.log(`MongoDB test container running: ${process.env.MONGO_TEST_URI}`);

  //cleanup function for vitest
  return async function () {
    console.log("Stopping MongoDB test container");
    await mongoTestContainer.stop();
    console.log("MongoDB Test container stopped.");
  };
}

//Note: To spin up multiple containers use Promise.all() for each variable for each service. Or use a docker composer file.
