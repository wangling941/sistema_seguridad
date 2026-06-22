import { ValidationError } from "../exceptions/DomainError";

export class User {
  constructor(
    public readonly id: number | undefined,
    public readonly username: string,
    public readonly password: string, // hashed
    public readonly createdAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.username || this.username.length < 3) {
      throw new ValidationError("Username must be at least 3 characters");
    }
    if (!this.password || this.password.length < 6) {
      throw new ValidationError("Password must be at least 6 characters");
    }
  }

  static fromPrimitives(data: any): User {
    return new User(
      data.id,
      data.username,
      data.password,
      data.createdAt ? new Date(data.createdAt) : new Date(),
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      username: this.username,
      password: this.password,
      createdAt: this.createdAt,
    };
  }
}
