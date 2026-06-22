import { IVisitorRepository } from "../../ports/repositories/IVisitorRepository";

export class GetAllVisitorsUseCase {
  constructor(private visitorRepository: IVisitorRepository) {}

  async execute(search?: string, page: number = 1, limit: number = 20) {
    return this.visitorRepository.findAll(search, page, limit);
  }
}
