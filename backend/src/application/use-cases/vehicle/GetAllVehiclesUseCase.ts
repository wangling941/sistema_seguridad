import { IVehicleRepository } from "../../ports/repositories/IVehicleRepository";

export class GetAllVehiclesUseCase {
  constructor(private vehicleRepository: IVehicleRepository) {}

  async execute(search?: string, page: number = 1, limit: number = 20) {
    return this.vehicleRepository.findAll(search, page, limit);
  }
}
