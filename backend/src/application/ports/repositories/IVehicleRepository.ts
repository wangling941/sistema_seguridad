import { Vehicle } from "../../../domain/entities/Vehicle";

export interface IVehicleRepository {
  findAll(
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Vehicle[]; total: number }>;
  findById(id: number): Promise<Vehicle | null>;
  findByPlate(plate: string): Promise<Vehicle | null>;
  create(vehicle: Vehicle): Promise<Vehicle>;
  update(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle>;
  delete(id: number): Promise<void>;
  countByResident(): Promise<{ name: string; count: number }[]>;
}
