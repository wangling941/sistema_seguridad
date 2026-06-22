import { IResidentRepository } from "../../ports/repositories/IResidentRepository";
import { NotFoundError } from "../../../domain/exceptions/DomainError";

export class DeleteResidentUseCase {
  constructor(private residentRepository: IResidentRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.residentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Resident", id);
    }
    await this.residentRepository.delete(id);
  }
}
