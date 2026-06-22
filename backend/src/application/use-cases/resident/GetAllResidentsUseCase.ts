import { IResidentRepository } from "../../ports/repositories/IResidentRepository";

export class GetAllResidentsUseCase {
  constructor(private residentRepository: IResidentRepository) {}

  async execute(search?: string, page: number = 1, limit: number = 20) {
    return this.residentRepository.findAll(search, page, limit);
  }
}
