import { IVehicleRepository } from "../../../../application/ports/repositories/IVehicleRepository";
import { Vehicle } from "../../../../domain/entities/Vehicle";
import prisma from "../../client";
import { Prisma } from "@prisma/client";

export class PrismaVehicleRepository implements IVehicleRepository {
  async findAll(search?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where: Prisma.VehicleWhereInput = search
      ? {
          OR: [
            { plate: { contains: search, mode: "insensitive" } },
            { resident: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        skip,
        take: limit,
        orderBy: { plate: "asc" },
        include: { resident: true },
      }),
      prisma.vehicle.count({ where }),
    ]);

    return {
      data: data.map((v) =>
        Vehicle.fromPrimitives({
          id: v.id,
          plate: v.plate,
          residentId: v.residentId,
          createdAt: v.createdAt,
        }),
      ),
      total,
    };
  }

  async findById(id: number): Promise<Vehicle | null> {
    const data = await prisma.vehicle.findUnique({ where: { id } });
    if (!data) return null;
    return Vehicle.fromPrimitives(data);
  }

  async findByPlate(plate: string): Promise<Vehicle | null> {
    const data = await prisma.vehicle.findUnique({ where: { plate } });
    if (!data) return null;
    return Vehicle.fromPrimitives(data);
  }

  async create(vehicle: Vehicle): Promise<Vehicle> {
    const data = await prisma.vehicle.create({
      data: {
        plate: vehicle.plate,
        residentId: vehicle.residentId,
      },
    });
    return Vehicle.fromPrimitives(data);
  }

  async update(id: number, vehicle: Partial<Vehicle>): Promise<Vehicle> {
    const data = await prisma.vehicle.update({
      where: { id },
      data: {
        plate: vehicle.plate,
        residentId: vehicle.residentId,
      },
    });
    return Vehicle.fromPrimitives(data);
  }

  async delete(id: number): Promise<void> {
    await prisma.vehicle.delete({ where: { id } });
  }

  async countByResident(): Promise<{ name: string; count: number }[]> {
    const results = await prisma.vehicle.groupBy({
      by: ["residentId"],
      _count: { residentId: true },
      orderBy: { _count: { residentId: "desc" } },
      take: 10,
    });

    const residentIds = results
      .map((r) => r.residentId)
      .filter((id): id is number => id !== null);
    const residents = await prisma.resident.findMany({
      where: { id: { in: residentIds } },
      select: { id: true, name: true },
    });

    const residentMap = new Map(residents.map((r) => [r.id, r.name]));

    return results.map((r) => ({
      name: r.residentId
        ? residentMap.get(r.residentId) || "Sin Residente"
        : "Sin Residente",
      count: r._count.residentId,
    }));
  }
}
