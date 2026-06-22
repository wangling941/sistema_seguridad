import { IVisitorRepository } from "../../ports/repositories/IVisitorRepository";
import { CreateVisitorDto } from "../../dto/CreateVisitorDto";
import { Visitor } from "../../../domain/entities/Visitor";
import { ConflictError } from "../../../domain/exceptions/DomainError";

export class CreateVisitorUseCase {
  constructor(private visitorRepository: IVisitorRepository) {}

  async execute(dto: CreateVisitorDto): Promise<Visitor> {
    const existing = await this.visitorRepository.findByDni(dto.dni);
    if (existing) {
      throw new ConflictError("Visitor with this DNI already exists");
    }

    const visitor = new Visitor(
      undefined,
      dto.name,
      dto.dni,
      dto.hasVehicle || false,
      dto.vehiclePlate || null,
      dto.companionsCount || null,
      dto.status || "active",
      dto.lastEntry || null,
      dto.lastExit || null,
    );

    return this.visitorRepository.create(visitor);
  }
}
