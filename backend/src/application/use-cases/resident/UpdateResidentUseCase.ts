import { IResidentRepository } from "../../ports/repositories/IResidentRepository";
import { UpdateResidentDto } from "../../dto/UpdateResidentDto";
import {
  NotFoundError,
  ConflictError,
} from "../../../domain/exceptions/DomainError";

export class UpdateResidentUseCase {
  constructor(private residentRepository: IResidentRepository) {}

  async execute(id: number, dto: UpdateResidentDto) {
    const existing = await this.residentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Resident", id);
    }

    if (dto.dni) {
      const dniConflict = await this.residentRepository.findByDni(dto.dni);
      if (dniConflict && dniConflict.id !== id) {
        throw new ConflictError("DNI already in use by another resident");
      }
    }

    return this.residentRepository.update(id, dto);
  }
}
