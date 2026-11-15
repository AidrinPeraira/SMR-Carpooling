import { AuthSessionNames } from "@sharemyride/shared";
import { getRedisClient } from "#/config/redis.config";
import { logger } from "#/services/LoggerService";

export class BlacklistService {
  /**
   * Checks whether the user is present in the session blacklist in redis
   *
   * @param userId The ID of the user to check
   * @returns true / false
   */
  public async isSessionBlacklisted(userId: string): Promise<boolean> {
    try {
      const client = getRedisClient();
      const isMember = await client.sIsMember(
        AuthSessionNames.AUTH_BLACKLIST,
        userId,
      );
      return Boolean(isMember);
    } catch (error) {
      logger.error("Error checking session blacklist:", error);
      return false;
    }
  }
}

export const blacklistService = new BlacklistService();
