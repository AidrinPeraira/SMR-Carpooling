export class VerificationToken {
  constructor(
    public readonly value: string,
    public readonly expiresAt: Date,
  ) {}

  public isExpired() {
    return new Date() > this.expiresAt;
  }
}
