import { IVehicleRepository } from "../../ports/repositories/IVehicleRepository";
import { UpdateVehicleDto } from "../../dto/UpdateVehicleDto";
import {
  NotFoundError,
  ConflictError,
} from "../../../domain/exceptions/DomainError";

export class UpdateVehicleUseCase {
  constructor(private vehicleRepository: IVehicleRepository) {}

  async execute(id: number, dto: UpdateVehicleDto) {
    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Vehicle", id);
    }

    if (dto.plate) {
      const plateConflict = await this.vehicleRepository.findByPlate(dto.plate);
      if (plateConflict && plateConflict.id !== id) {
        throw new ConflictError("Plate already in use by another vehicle");
      }
    }

    return this.vehicleRepository.update(id, dto);
  }
}
