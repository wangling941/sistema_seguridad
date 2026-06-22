import { IVisitorRepository } from "../../ports/repositories/IVisitorRepository";
import { NotFoundError } from "../../../domain/exceptions/DomainError";

export class GetVisitorByIdUseCase {
  constructor(private visitorRepository: IVisitorRepository) {}

  async execute(id: number) {
    const visitor = await this.visitorRepository.findById(id);
    if (!visitor) {
      throw new NotFoundError("Visitor", id);
    }
    return visitor;
  }
}
