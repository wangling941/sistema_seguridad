import { IVisitorRepository } from "../../ports/repositories/IVisitorRepository";
import { NotFoundError } from "../../../domain/exceptions/DomainError";

export class DeleteVisitorUseCase {
  constructor(private visitorRepository: IVisitorRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.visitorRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Visitor", id);
    }
    await this.visitorRepository.delete(id);
  }
}
