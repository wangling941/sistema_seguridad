import { IVehicleRepository } from "../../ports/repositories/IVehicleRepository";
import { NotFoundError } from "../../../domain/exceptions/DomainError";

export class DeleteVehicleUseCase {
  constructor(private vehicleRepository: IVehicleRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Vehicle", id);
    }
    await this.vehicleRepository.delete(id);
  }
}
