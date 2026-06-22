import { Visitor } from "../../../domain/entities/Visitor";

export interface IVisitorRepository {
  findAll(
    search?: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Visitor[]; total: number }>;
  findById(id: number): Promise<Visitor | null>;
  findByDni(dni: string): Promise<Visitor | null>;
  create(visitor: Visitor): Promise<Visitor>;
  update(id: number, visitor: Partial<Visitor>): Promise<Visitor>;
  delete(id: number): Promise<void>;
  countByStatus(): Promise<{ status: string; count: number }[]>;
}
