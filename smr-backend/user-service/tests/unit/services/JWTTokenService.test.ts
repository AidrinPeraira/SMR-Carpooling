import { describe, it, expect } from "vitest";
import { JWTTokenService } from "#/infrastructure/services/JwtTokenService";
import jwt from "jsonwebtoken";

describe("JWTTokenService", () => {
  const tokenService = new JWTTokenService();
  const secret = "test-secret-key";
  const payload = { userId: "user-123", role: "admin" };

  it("should generate a valid JWT token", () => {
    const token = tokenService.generateToken(payload, secret);
    
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    
    // Verify it's actually a JWT (3 parts)
    expect(token.split(".")).toHaveLength(3);
  });

  it("should correctly verify and decode a valid token", () => {
    const token = tokenService.generateToken(payload, secret);
    const decoded = tokenService.verifyToken<{ userId: string; role: string }>(token, secret);
    
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it("should throw an error for a token signed with a different secret", () => {
    const token = tokenService.generateToken(payload, "wrong-secret");
    
    expect(() => {
      tokenService.verifyToken(token, secret);
    }).toThrow();
  });

  it("should throw an error for a malformed token", () => {
    expect(() => {
      tokenService.verifyToken("not.a.token", secret);
    }).toThrow();
  });

  it("should throw an error for an expired token", () => {
    // Generate an expired token using the underlying library
    const expiredToken = jwt.sign(payload, secret, { expiresIn: "-1h" });
    
    expect(() => {
      tokenService.verifyToken(expiredToken, secret);
    }).toThrow(jwt.TokenExpiredError);
  });
});
