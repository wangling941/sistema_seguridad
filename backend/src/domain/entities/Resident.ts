import { ValidationError } from "../exceptions/DomainError";

export type ResidentStatus = "active" | "inactive";

export class Resident {
  constructor(
    public readonly id: number | undefined,
    public readonly name: string,
    public readonly dni: string,
    public readonly status: ResidentStatus = "active",
    public readonly createdAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new ValidationError("Name is required");
    }
    if (!this.dni || !/^[0-9]{8}$/.test(this.dni)) {
      throw new ValidationError("DNI must be exactly 8 digits");
    }
    if (!["active", "inactive"].includes(this.status)) {
      throw new ValidationError("Status must be active or inactive");
    }
  }

  static fromPrimitives(data: any): Resident {
    return new Resident(
      data.id,
      data.name,
      data.dni,
      data.status || "active",
      data.createdAt ? new Date(data.createdAt) : new Date(),
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      dni: this.dni,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
