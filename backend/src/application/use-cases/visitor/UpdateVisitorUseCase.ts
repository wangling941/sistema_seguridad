import { IVisitorRepository } from "../../ports/repositories/IVisitorRepository";
import { UpdateVisitorDto } from "../../dto/UpdateVisitorDto";
import {
  NotFoundError,
  ConflictError,
} from "../../../domain/exceptions/DomainError";

export class UpdateVisitorUseCase {
  constructor(private visitorRepository: IVisitorRepository) {}

  async execute(id: number, dto: UpdateVisitorDto) {
    const existing = await this.visitorRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Visitor", id);
    }

    if (dto.dni) {
      const dniConflict = await this.visitorRepository.findByDni(dto.dni);
      if (dniConflict && dniConflict.id !== id) {
        throw new ConflictError("DNI already in use by another visitor");
      }
    }

    return this.visitorRepository.update(id, dto);
  }
}
