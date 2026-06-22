import { IResidentRepository } from "../../ports/repositories/IResidentRepository";
import { CreateResidentDto } from "../../dto/CreateResidentDto";
import { Resident } from "../../../domain/entities/Resident";
import { ConflictError } from "../../../domain/exceptions/DomainError";

export class CreateResidentUseCase {
  constructor(private residentRepository: IResidentRepository) {}

  async execute(dto: CreateResidentDto): Promise<Resident> {
    const existing = await this.residentRepository.findByDni(dto.dni);
    if (existing) {
      throw new ConflictError("Resident with this DNI already exists");
    }

    const resident = new Resident(
      undefined,
      dto.name,
      dto.dni,
      dto.status || "active",
    );

    return this.residentRepository.create(resident);
  }
}
