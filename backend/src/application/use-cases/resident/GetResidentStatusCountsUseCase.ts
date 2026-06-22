import { IResidentRepository } from "../../ports/repositories/IResidentRepository";

export class GetResidentStatusCountsUseCase {
  constructor(private residentRepository: IResidentRepository) {}

  async execute() {
    return this.residentRepository.countByStatus();
  }
}
