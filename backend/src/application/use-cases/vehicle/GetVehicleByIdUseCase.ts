import { IVehicleRepository } from "../../ports/repositories/IVehicleRepository";
import { NotFoundError } from "../../../domain/exceptions/DomainError";

export class GetVehicleByIdUseCase {
  constructor(private vehicleRepository: IVehicleRepository) {}

  async execute(id: number) {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new NotFoundError("Vehicle", id);
    }
    return vehicle;
  }
}
