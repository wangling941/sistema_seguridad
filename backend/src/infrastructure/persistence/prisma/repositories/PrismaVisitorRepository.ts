import { IVisitorRepository } from "../../../../application/ports/repositories/IVisitorRepository";
import { Visitor } from "../../../../domain/entities/Visitor";
import prisma from "../../client";
import { Prisma } from "@prisma/client";

export class PrismaVisitorRepository implements IVisitorRepository {
  async findAll(search?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where: Prisma.VisitorWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { dni: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.visitor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { name: "asc" },
      }),
      prisma.visitor.count({ where }),
    ]);

    return {
      data: data.map((v) =>
        Visitor.fromPrimitives({
          ...v,
          hasVehicle: v.hasVehicle,
          vehiclePlate: v.vehiclePlate,
          companionsCount: v.companionsCount,
          status: v.status,
          lastEntry: v.lastEntry,
          lastExit: v.lastExit,
        }),
      ),
      total,
    };
  }

  async findById(id: number): Promise<Visitor | null> {
    const data = await prisma.visitor.findUnique({ where: { id } });
    if (!data) return null;
    return Visitor.fromPrimitives(data);
  }

  async findByDni(dni: string): Promise<Visitor | null> {
    const data = await prisma.visitor.findUnique({ where: { dni } });
    if (!data) return null;
    return Visitor.fromPrimitives(data);
  }

  async create(visitor: Visitor): Promise<Visitor> {
    const data = await prisma.visitor.create({
      data: {
        name: visitor.name,
        dni: visitor.dni,
        hasVehicle: visitor.hasVehicle,
        vehiclePlate: visitor.vehiclePlate,
        companionsCount: visitor.companionsCount,
        status: visitor.status,
        lastEntry: visitor.lastEntry,
        lastExit: visitor.lastExit,
      },
    });
    return Visitor.fromPrimitives(data);
  }

  async update(id: number, visitor: Partial<Visitor>): Promise<Visitor> {
    const data = await prisma.visitor.update({
      where: { id },
      data: {
        name: visitor.name,
        dni: visitor.dni,
        hasVehicle: visitor.hasVehicle,
        vehiclePlate: visitor.vehiclePlate,
        companionsCount: visitor.companionsCount,
        status: visitor.status,
        lastEntry: visitor.lastEntry,
        lastExit: visitor.lastExit,
      },
    });
    return Visitor.fromPrimitives(data);
  }

  async delete(id: number): Promise<void> {
    await prisma.visitor.delete({ where: { id } });
  }

  async countByStatus(): Promise<{ status: string; count: number }[]> {
    const result = await prisma.visitor.groupBy({
      by: ["status"],
      _count: { status: true },
    });
    return result.map((item) => ({
      status: item.status,
      count: item._count.status,
    }));
  }
}
