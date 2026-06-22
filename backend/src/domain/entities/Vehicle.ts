import { ValidationError } from "../exceptions/DomainError";

export class Vehicle {
  constructor(
    public readonly id: number | undefined,
    public readonly plate: string,
    public readonly residentId: number | null = null,
    public readonly createdAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.plate || !/^[A-Za-z0-9\-]+$/.test(this.plate)) {
      throw new ValidationError(
        "Plate must contain only letters, numbers and hyphens",
      );
    }
  }

  static fromPrimitives(data: any): Vehicle {
    return new Vehicle(
      data.id,
      data.plate,
      data.residentId || null,
      data.createdAt ? new Date(data.createdAt) : new Date(),
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      plate: this.plate,
      residentId: this.residentId,
      createdAt: this.createdAt,
    };
  }
}
