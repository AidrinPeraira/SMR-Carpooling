import { describe, it, expect } from "vitest";
import { JWTTokenService } from "#/infrastructure/services/JwtTokenService";
import jwt from "jsonwebtoken";
import { AuthTokenPayload, TokenType, UserRole } from "@smr/shared";

describe("JWTTokenService", () => {
  const genericSecret = "generic-secret";
  const accessSecret = "access-secret";
  const refreshSecret = "refresh-secret";
  
  const tokenService = new JWTTokenService(genericSecret, accessSecret, refreshSecret);
  
  const genericPayload = { userId: "user-123", role: "admin" };
  
  const authPayload: AuthTokenPayload = {
    user: {
      userId: "user-123",
      emailId: "test@test.com",
      firstName: "Test",
      lastName: "User",
      userRole: UserRole.PASSENGER
    },
    tokenType: TokenType.ACCESS_TOKEN,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600
  };

  describe("Generic Token Methods", () => {
    it("should generate a valid JWT token using generic secret", () => {
      const token = tokenService.generateToken(genericPayload);
      expect(token).toBeDefined();
      
      const decoded = jwt.verify(token, genericSecret) as any;
      expect(decoded.userId).toBe(genericPayload.userId);
    });

    it("should correctly verify and decode a valid token", () => {
      const token = jwt.sign(genericPayload, genericSecret);
      const decoded = tokenService.verifyToken<{ userId: string; role: string }>(token);
      
      expect(decoded.userId).toBe(genericPayload.userId);
    });

    it("should throw an error for a token signed with a different secret", () => {
      const token = jwt.sign(genericPayload, "wrong-secret");
      expect(() => tokenService.verifyToken(token)).toThrow();
    });
  });

  describe("Access Token Methods", () => {
    it("should generate a valid access token", () => {
      const token = tokenService.generateAccessToken(authPayload);
      const decoded = jwt.verify(token, accessSecret) as AuthTokenPayload;
      
      expect(decoded.user.userId).toBe(authPayload.user.userId);
      expect(decoded.tokenType).toBe(TokenType.ACCESS_TOKEN);
    });

    it("should verify a valid access token", () => {
      const token = jwt.sign(authPayload, accessSecret);
      const decoded = tokenService.verifyAccessToken(token);
      
      expect(decoded.user.userId).toBe(authPayload.user.userId);
    });
  });

  describe("Refresh Token Methods", () => {
    const refreshPayload: AuthTokenPayload = { ...authPayload, tokenType: TokenType.REFRESH_TOKEN };

    it("should generate a valid refresh token", () => {
      const token = tokenService.generateRefreshToken(refreshPayload);
      const decoded = jwt.verify(token, refreshSecret) as AuthTokenPayload;
      
      expect(decoded.user.userId).toBe(refreshPayload.user.userId);
      expect(decoded.tokenType).toBe(TokenType.REFRESH_TOKEN);
    });

    it("should verify a valid refresh token", () => {
      const token = jwt.sign(refreshPayload, refreshSecret);
      const decoded = tokenService.verifyRefreshToken(token);
      
      expect(decoded.user.userId).toBe(refreshPayload.user.userId);
    });
  });

  it("should throw an error for an expired token", () => {
    const expiredPayload: AuthTokenPayload = { 
      ...authPayload, 
      exp: Math.floor(Date.now() / 1000) - 3600 
    };
    const token = jwt.sign(expiredPayload, accessSecret);
    
    expect(() => tokenService.verifyAccessToken(token)).toThrow(jwt.TokenExpiredError);
  });
});
