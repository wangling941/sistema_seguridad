import { Resident } from "../../../domain/entities/Resident";

export interface IResidentRepository {
  findAll(
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Resident[]; total: number }>;
  findById(id: number): Promise<Resident | null>;
  findByDni(dni: string): Promise<Resident | null>;
  create(resident: Resident): Promise<Resident>;
  update(id: number, resident: Partial<Resident>): Promise<Resident>;
  delete(id: number): Promise<void>;
  countByStatus(): Promise<{ status: string; count: number }[]>;
}
