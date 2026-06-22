import { IVehicleRepository } from "../../ports/repositories/IVehicleRepository";
import { CreateVehicleDto } from "../../dto/CreateVehicleDto";
import { Vehicle } from "../../../domain/entities/Vehicle";
import { ConflictError } from "../../../domain/exceptions/DomainError";

export class CreateVehicleUseCase {
  constructor(private vehicleRepository: IVehicleRepository) {}

  async execute(dto: CreateVehicleDto): Promise<Vehicle> {
    const existing = await this.vehicleRepository.findByPlate(dto.plate);
    if (existing) {
      throw new ConflictError("Vehicle with this plate already exists");
    }

    const vehicle = new Vehicle(undefined, dto.plate, dto.residentId || null);

    return this.vehicleRepository.create(vehicle);
  }
}
