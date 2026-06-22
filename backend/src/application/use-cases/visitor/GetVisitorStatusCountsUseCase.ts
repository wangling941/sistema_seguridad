import { IVisitorRepository } from "../../ports/repositories/IVisitorRepository";

export class GetVisitorStatusCountsUseCase {
  constructor(private visitorRepository: IVisitorRepository) {}

  async execute() {
    return this.visitorRepository.countByStatus();
  }
}
