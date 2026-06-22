import { ValidationError } from "../exceptions/DomainError";

export type VisitorStatus = "active" | "inactive";

export class Visitor {
  constructor(
    public readonly id: number | undefined,
    public readonly name: string,
    public readonly dni: string,
    public readonly hasVehicle: boolean = false,
    public readonly vehiclePlate: string | null = null,
    public readonly companionsCount: number | null = null,
    public readonly status: VisitorStatus = "active",
    public readonly lastEntry: Date | null = null,
    public readonly lastExit: Date | null = null,
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
    if (this.hasVehicle && !this.vehiclePlate) {
      throw new ValidationError(
        "Vehicle plate is required when hasVehicle is true",
      );
    }
    if (
      this.hasVehicle &&
      this.vehiclePlate &&
      !/^[A-Za-z0-9\-]+$/.test(this.vehiclePlate)
    ) {
      throw new ValidationError(
        "Vehicle plate must contain only letters, numbers and hyphens",
      );
    }
    if (this.companionsCount !== null && this.companionsCount < 0) {
      throw new ValidationError("Companions count cannot be negative");
    }
  }

  static fromPrimitives(data: any): Visitor {
    return new Visitor(
      data.id,
      data.name,
      data.dni,
      data.hasVehicle || false,
      data.vehiclePlate || null,
      data.companionsCount !== undefined && data.companionsCount !== null
        ? data.companionsCount
        : null,
      data.status || "active",
      data.lastEntry ? new Date(data.lastEntry) : null,
      data.lastExit ? new Date(data.lastExit) : null,
      data.createdAt ? new Date(data.createdAt) : new Date(),
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      name: this.name,
      dni: this.dni,
      hasVehicle: this.hasVehicle,
      vehiclePlate: this.vehiclePlate,
      companionsCount: this.companionsCount,
      status: this.status,
      lastEntry: this.lastEntry,
      lastExit: this.lastExit,
      createdAt: this.createdAt,
    };
  }
}
