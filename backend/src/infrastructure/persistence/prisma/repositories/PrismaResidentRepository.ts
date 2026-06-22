import { IResidentRepository } from "../../../../application/ports/repositories/IResidentRepository";
import { Resident } from "../../../../domain/entities/Resident";
import prisma from "../../client";
import { Prisma } from "@prisma/client";

export class PrismaResidentRepository implements IResidentRepository {
  async findAll(search?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where: Prisma.ResidentWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { dni: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.resident.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.resident.count({ where }),
    ]);

    return {
      data: data.map((r) =>
        Resident.fromPrimitives({
          ...r,
          status: r.status,
        }),
      ),
      total,
    };
  }

  async findById(id: number): Promise<Resident | null> {
    const data = await prisma.resident.findUnique({ where: { id } });
    if (!data) return null;
    return Resident.fromPrimitives({ ...data, status: data.status });
  }

  async findByDni(dni: string): Promise<Resident | null> {
    const data = await prisma.resident.findUnique({ where: { dni } });
    if (!data) return null;
    return Resident.fromPrimitives({ ...data, status: data.status });
  }

  async create(resident: Resident): Promise<Resident> {
    const data = await prisma.resident.create({
      data: {
        name: resident.name,
        dni: resident.dni,
        status: resident.status,
      },
    });
    return Resident.fromPrimitives({ ...data, status: data.status });
  }

  async update(id: number, resident: Partial<Resident>): Promise<Resident> {
    const data = await prisma.resident.update({
      where: { id },
      data: {
        name: resident.name,
        dni: resident.dni,
        status: resident.status,
      },
    });
    return Resident.fromPrimitives({ ...data, status: data.status });
  }

  async delete(id: number): Promise<void> {
    await prisma.resident.delete({ where: { id } });
  }

  async countByStatus(): Promise<{ status: string; count: number }[]> {
    const result = await prisma.resident.groupBy({
      by: ["status"],
      _count: { status: true },
    });
    return result.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));
  }
}
