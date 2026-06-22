import { ValidationError } from "../exceptions/DomainError";

export class AccessLog {
  constructor(
    public readonly id: number | undefined,
    public readonly residentId: number | null = null,
    public readonly vehicleId: number | null = null,
    public readonly visitorId: number | null = null, // <-- NUEVO
    public readonly entryDatetime: Date = new Date(),
    public readonly exitDatetime: Date | null = null,
    public readonly createdAt: Date = new Date(),
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.entryDatetime) {
      throw new ValidationError("Entry datetime is required");
    }
    if (this.exitDatetime && this.exitDatetime < this.entryDatetime) {
      throw new ValidationError(
        "Exit datetime cannot be before entry datetime",
      );
    }
  }

  static fromPrimitives(data: any): AccessLog {
    return new AccessLog(
      data.id,
      data.residentId || null,
      data.vehicleId || null,
      data.visitorId || null,
      data.entryDatetime ? new Date(data.entryDatetime) : new Date(),
      data.exitDatetime ? new Date(data.exitDatetime) : null,
      data.createdAt ? new Date(data.createdAt) : new Date(),
    );
  }

  toPrimitives() {
    return {
      id: this.id,
      residentId: this.residentId,
      vehicleId: this.vehicleId,
      visitorId: this.visitorId,
      entryDatetime: this.entryDatetime,
      exitDatetime: this.exitDatetime,
      createdAt: this.createdAt,
    };
  }
}
