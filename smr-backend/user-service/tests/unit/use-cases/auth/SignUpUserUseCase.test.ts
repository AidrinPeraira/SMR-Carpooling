/**
 * This file is an exmple to understand the concept and workflow is testing.
 * This is not upto architectural standards. This is intentional.
 * Use this as a reference and optimise other tests with the optimisations
 * available in vitest and by splitting the code into different files in the appropriate folders.
 */

import { SignUpRequestDTO } from "#/application/dto/auth/SignUpRequestDTO";
import { IUserRepository } from "#/application/interfaces/repository/IUserRepository";
import { IEventBus } from "#/application/interfaces/services/IEventBus";
import { IHashingService } from "#/application/interfaces/services/IHashingService";
import { ITokenService } from "#/application/interfaces/services/ITokenService";
import { IUniqueIdGenerator } from "#/application/interfaces/services/IUniqueIdGenerator";
import { ISignupUserUseCase } from "#/application/interfaces/use-case/auth/ISignUpUserUseCase";
import { SignUpUserUseCase } from "#/application/use-case/auth/SignUpUserUseCase";
import { ApplicationError } from "@smr/shared";
import { describe, expect, it, vi } from "vitest";

/**
 * Basic idea of testing:
 * - describe is the group of test. A container for what we are testing.
 *   - Inside we write the differnt tests for that particualara part of code
 *   - "it" -> used to define each single test.
 *   - What we write inside "it"
 *      - We create mock dependencies using "vi" (Arrange)
 *      - Inject and run an instance of the requied code (Act)
 *      - We check  if the result is as expected (Assert)
 */

describe("SignUpUserUseCase", () => {
  it("Should create a new user", async () => {
    //Mock dependencies for SIgnupUserUseCase. We create mock classes and their mock instances.
    const UserRepository = vi.fn(
      class implements IUserRepository {
        constructor() {}
        find = vi.fn();
        findById = vi.fn();
        findByCustomId = vi.fn();
        findByEmail = vi.fn();
        save = vi.fn();
        updateById = vi.fn();
        updateByCustomId = vi.fn();
        deleteById = vi.fn();
        deleteByCustomId = vi.fn();
      },
    );
    const mockUserRepository = new UserRepository();

    const HashingService = vi.fn(
      class implements IHashingService {
        createHash = vi.fn();
        compareHash = vi.fn();
      },
    );
    const mockHashingService = new HashingService();

    const UidGenerator = vi.fn(
      class implements IUniqueIdGenerator {
        generateRandomId = vi.fn();
      },
    );
    const mockUidGenerator = new UidGenerator();

    const TokenService = vi.fn(
      class implements ITokenService {
        generateToken = vi.fn();
        verifyToken = vi.fn();
        generateAccessToken = vi.fn();
        verifyAccessToken = vi.fn();
        generateRefreshToken = vi.fn();
        verifyRefreshToken = vi.fn();
      },
    );
    const mockTokenService = new TokenService();

    const EventBus = vi.fn(
      class implements IEventBus {
        publish = vi.fn();
      },
    );
    const mockEventBus = new EventBus();

    //Create an instance of the use case using the mock deps.
    //lets use "any" initially. Change later.
    const signUpUserUseCase: ISignupUserUseCase = new SignUpUserUseCase(
      mockUserRepository,
      mockHashingService,
      mockUidGenerator,
      mockTokenService,
      mockEventBus,
    );

    //create mock input data
    const mockSignUpData: SignUpRequestDTO = {
      firstName: "Test",
      lastName: "User",
      emailId: "sample@mail.com",
      phoneNumber: "9879879870",
      password: "123qweASD@",
      confirmPassword: "123qweASD@",
    };

    //tell mock dependencies to what to return
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue(null); // resokved values is for functions that return promises
    vi.mocked(mockUserRepository.save).mockResolvedValue({
      userId: "ABC123",
      firstName: "Test",
      lastName: "User",
      emailId: "sample@mail.com",
      phoneNumber: "9879879870",
    });
    vi.mocked(mockUserRepository.updateById).mockResolvedValue({
      userId: "ABC123",
      firstName: "Test",
      lastName: "User",
      emailId: "sample@mail.com",
      phoneNumber: "9879879870",
    });
    vi.mocked(mockHashingService.createHash).mockReturnValue("mock-hash-value");
    vi.mocked(mockUidGenerator.generateRandomId).mockReturnValue("ABC123");
    vi.mocked(mockTokenService.generateToken).mockReturnValue(
      "mock-token-value",
    );
    vi.mocked(mockEventBus.publish).mockReturnValue(undefined);

    // Now we call the use case. (ACT)
    const result = await signUpUserUseCase.execute(mockSignUpData);

    //check if the result is same and everything was called properly (Assert)
    expect(result).toEqual({
      userId: "ABC123",
      firstName: "Test",
      lastName: "User",
      emailId: "sample@mail.com",
    });

    expect(mockUserRepository.save).toHaveBeenCalledTimes(1);
  });

  it("Should throw Conflict error if user is already verified", async () => {
    // We repeat the mock setup here to keep this "Master Example" file simple and self-contained
    const mockUserRepository = new (vi.fn(
      class implements IUserRepository {
        find = vi.fn();
        findById = vi.fn();
        findByCustomId = vi.fn();
        findByEmail = vi.fn();
        save = vi.fn();
        updateById = vi.fn();
        updateByCustomId = vi.fn();
        deleteById = vi.fn();
        deleteByCustomId = vi.fn();
      },
    ))();

    const mockHashingService = new (vi.fn(
      class implements IHashingService {
        createHash = vi.fn();
        compareHash = vi.fn();
      },
    ))();

    const mockUidGenerator = new (vi.fn(
      class implements IUniqueIdGenerator {
        generateRandomId = vi.fn();
      },
    ))();

    const mockTokenService = new (vi.fn(
      class implements ITokenService {
        generateToken = vi.fn();
        verifyToken = vi.fn();
        generateAccessToken = vi.fn();
        verifyAccessToken = vi.fn();
        generateRefreshToken = vi.fn();
        verifyRefreshToken = vi.fn();
      },
    ))();

    const mockEventBus = new (vi.fn(
      class implements IEventBus {
        publish = vi.fn();
      },
    ))();

    const signUpUserUseCase = new SignUpUserUseCase(
      mockUserRepository,
      mockHashingService,
      mockUidGenerator,
      mockTokenService,
      mockEventBus,
    );

    const mockSignUpData: SignUpRequestDTO = {
      firstName: "Test",
      lastName: "User",
      emailId: "sample@mail.com",
      phoneNumber: "9879879870",
      password: "123qweASD@",
      confirmPassword: "123qweASD@",
    };

    // Arrange: Simulate that a VERIFIED user already exists
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue({
      emailId: "sample@mail.com",
      emailVerified: true,
    } as any);

    // Act & Assert
    await expect(signUpUserUseCase.execute(mockSignUpData)).rejects.toThrow(
      ApplicationError,
    );

    // Verify side effects: We should NOT have saved anything or hashed the password
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockHashingService.createHash).not.toHaveBeenCalled();
  });

  it("Should update existing unverified user instead of creating a new one", async () => {
    const mockUserRepository = new (vi.fn(
      class implements IUserRepository {
        find = vi.fn();
        findById = vi.fn();
        findByCustomId = vi.fn();
        findByEmail = vi.fn();
        save = vi.fn();
        updateById = vi.fn();
        updateByCustomId = vi.fn();
        deleteById = vi.fn();
        deleteByCustomId = vi.fn();
      },
    ))();

    const mockHashingService = new (vi.fn(
      class implements IHashingService {
        createHash = vi.fn();
        compareHash = vi.fn();
      },
    ))();

    const mockUidGenerator = new (vi.fn(
      class implements IUniqueIdGenerator {
        generateRandomId = vi.fn();
      },
    ))();

    const mockTokenService = new (vi.fn(
      class implements ITokenService {
        generateToken = vi.fn();
        verifyToken = vi.fn();
        generateAccessToken = vi.fn();
        verifyAccessToken = vi.fn();
        generateRefreshToken = vi.fn();
        verifyRefreshToken = vi.fn();
      },
    ))();

    const mockEventBus = new (vi.fn(
      class implements IEventBus {
        publish = vi.fn();
      },
    ))();

    const signUpUserUseCase = new SignUpUserUseCase(
      mockUserRepository,
      mockHashingService,
      mockUidGenerator,
      mockTokenService,
      mockEventBus,
    );

    const mockSignUpData: SignUpRequestDTO = {
      firstName: "Test",
      lastName: "User",
      emailId: "sample@mail.com",
      phoneNumber: "9879879870",
      password: "123qweASD@",
      confirmPassword: "123qweASD@",
    };

    // Arrange: User exists but is NOT verified
    vi.mocked(mockUserRepository.findByEmail).mockResolvedValue({
      id: "existing-id",
      userId: "ABC123",
      emailId: "sample@mail.com",
      emailVerified: false,
    } as any);

    vi.mocked(mockUserRepository.updateById).mockResolvedValue({
      userId: "ABC123",
      firstName: "Test",
      lastName: "User",
      emailId: "sample@mail.com",
    });

    // Act
    await signUpUserUseCase.execute(mockSignUpData);

    // Assert
    expect(mockUserRepository.updateById).toHaveBeenCalled();
    expect(mockUserRepository.save).not.toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalled();
  });
});
