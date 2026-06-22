import { IResidentRepository } from "../../ports/repositories/IResidentRepository";
import { NotFoundError } from "../../../domain/exceptions/DomainError";

export class GetResidentByIdUseCase {
  constructor(private residentRepository: IResidentRepository) {}

  async execute(id: number) {
    const resident = await this.residentRepository.findById(id);
    if (!resident) {
      throw new NotFoundError("Resident", id);
    }
    return resident;
  }
}
