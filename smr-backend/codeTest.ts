//Domain

interface UserEntitiy {
  userId: string;
  userName: string;
  emailAddress: string;
  hashedPassword: string;
  isActive: boolean;
}

//Application

interface SignupReqDTO {
  user_name: string;
  email_address: string;
  password: string;
  confirmPassword: string;
}

interface ISignupUseCase {
  execute(dto: SignupReqDTO): Promise<void>;
}

interface IUserRepository {
  findByEmail(email: string): Promise<UserEntitiy | void>;
  save(newUser: Omit<UserEntitiy, "userId">): Promise<UserEntitiy>;
}

interface IHashingService {
  hashValue(value: string): string;
}

class SignupUseUseCase implements ISignupUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _hashService: IHashingService,
  ) {}

  async execute(dto: SignupReqDTO): Promise<void> {
    const existingUser = await this._userRepo.findByEmail(dto.email_address);

    if (existingUser) {
      throw new Error("user already exists");
    }

    if (dto.password !== dto.confirmPassword) {
      throw new Error("Password do not match");
    }

    const newUser: Omit<UserEntitiy, "userId"> = {
      userName: dto.user_name,
      emailAddress: dto.email_address,
      hashedPassword: this._hashService.hashValue(dto.password),
    };

    const createdUser = this._userRepo.save(newUser);
  }
}

//Infrastructure

class UserRepository implements IUserRepository {
  //we take the mongoose model or prisma model here
  private readonly _userModel: any;

  constructor() {}

  async save(newUser: Omit<UserEntitiy, "userId">): Promise<UserEntitiy> {
    return await this._userModel.save(newUser);
  }

  async findByEmail(email: string): Promise<UserEntitiy | void> {
    return await this._userModel.find({ emailId: email });
  }
}

class HashingService implements IHashingService {
  constructor() {}

  hashValue(value: string): string {
    return "HasehdString";
  }
}

//Presentation
