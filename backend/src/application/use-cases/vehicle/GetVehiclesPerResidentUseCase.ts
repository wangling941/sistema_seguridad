import { IVehicleRepository } from "../../ports/repositories/IVehicleRepository";

export class GetVehiclesPerResidentUseCase {
  constructor(private vehicleRepository: IVehicleRepository) {}

  async execute() {
    return this.vehicleRepository.countByResident();
  }
}
