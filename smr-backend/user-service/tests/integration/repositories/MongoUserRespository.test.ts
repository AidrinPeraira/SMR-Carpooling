import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { UserModel } from "#/infrastructure/database/models/MongoUserModel";
import { MongoUserRespository } from "#/infrastructure/repository/MongoUserRepository";
import mongoose from "mongoose";
import { beforeAll, afterEach, describe, it, expect } from "vitest";
import { createMockUserData } from "../../fixtures/dto/UserData";

describe("User Repository Integration", () => {
  //needed by all test cases
  let userRepository: IUserRepository;

  //before all test we conntect to mogno db container
  //and create the user repository instance
  beforeAll(async () => {
    const connectionUrl = process.env.MONGO_TEST_URI;

    if (!connectionUrl) {
      throw new Error("Connection url for test mongo not found in environment");
    }

    await mongoose.connect(connectionUrl);
    userRepository = new MongoUserRespository(UserModel);
  });

  //affter each test case clear collection to prevent conflict between mock data
  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (let collection in collections) {
      collections[collection]?.deleteMany({});
    }
  });

  it("should create a new user, with provided valid details, in the database.", async () => {
    const userData = createMockUserData();
    const newUser = await userRepository.save(userData);

    expect(newUser.id).toBeDefined();
    expect(newUser).toMatchObject(userData);

    //try finding it
    const existingUser = await userRepository.findByEmail(userData.emailId);
    expect(existingUser).toBeDefined();
    expect(existingUser).toMatchObject(userData);
  });

  it("should correctly map verificationToken to VerificationToken class instance.", async () => {
    const userData = createMockUserData({
      verificationToken: {
        value: "test-token",
        expiresAt: new Date(Date.now() + 3600000),
      },
    });
    await userRepository.save(userData);

    const existingUser = await userRepository.findByEmail(userData.emailId);
    expect(existingUser?.verificationToken).toBeDefined();
    expect(existingUser?.verificationToken?.value).toBe("test-token");
    expect(typeof existingUser?.verificationToken?.isExpired).toBe("function");
    expect(existingUser?.verificationToken?.isExpired()).toBe(false);
  });
});

/*

This file is incomplete. I have skipped writing tests for all methods implemented in the repository. 

Done: 
- Integration test for connection
- Test for creating new document and checking if it can be fetched using find.

To do (for future): 
- Write tests for all write operations.
- Write tests for all update operations
- Write tests for all delete operations.
- Write test for possible error cases for each of the above.
- Write test to check if data mapping from repository is propper.
 */
