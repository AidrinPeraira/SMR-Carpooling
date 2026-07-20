import { AppConfig } from "#/application.config";
import { IGoogleAuthService } from "#/application/interfaces/services/IGoogleAuthService";
import { UserEntity } from "#/domain/entities/UserEntity";
import {
  ApplicationError,
  ErrorCode,
  GenericErrorMessage,
  HttpStatusCodes,
} from "@sharemyride/shared";

import { OAuth2Client } from "google-auth-library";
import { CryptoHashingService } from "./CryptoHashingService";
import { randomBytes } from "node:crypto";

export class GoogleAuthService implements IGoogleAuthService {
  private readonly googleClient;
  constructor() {
    this.googleClient = new OAuth2Client(AppConfig.GOOGLE_CLIENT_ID);
  }

  async verifyToken(token: string): Promise<Partial<UserEntity>> {
    const result = await this.googleClient.verifyIdToken({
      idToken: token,
      audience: AppConfig.GOOGLE_CLIENT_ID,
    });

    const googleUser = result.getPayload();

    if (!googleUser) {
      throw new ApplicationError(
        GenericErrorMessage.UNAUTHORIZED,
        HttpStatusCodes.Unauthorized,
        ErrorCode.INPUT_UNAUTHORIZED,
        {
          location: "Google auth service",
          description: "Google token validation returned empty payload",
          reason:
            "Google authentication failed. Token validation returned empty payload.",
        },
      );
    }

    console.log(googleUser);

    const rawPassword = randomBytes(32).toString("hex");
    const hashingService = new CryptoHashingService();
    const passwordHash = hashingService.createHash(rawPassword);

    const user: Partial<UserEntity> = {
      firstName: googleUser.given_name,
      lastName: googleUser.family_name,
      emailId: googleUser.email,
      profileImage: googleUser.picture,
      phoneNumber: "00000000000",
      passwordHash,
    };

    return user;
  }
}
