import { IAccessLogRepository } from "../../../../application/ports/repositories/IAccessLogRepository";
import { AccessLog } from "../../../../domain/entities/AccessLog";
import { ReportFiltersDto } from "../../../../application/dto/ReportFiltersDto";
import prisma from "../../client";
import { Prisma } from "@prisma/client";

export class PrismaAccessLogRepository implements IAccessLogRepository {
  async findAll(search?: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    // Construir condición de búsqueda
    let where: Prisma.AccessLogWhereInput = {};

    if (search) {
      // Intentar parsear como número para buscar por ID
      const idNum = parseInt(search);
      const idCondition: Prisma.AccessLogWhereInput | undefined = isNaN(idNum)
        ? undefined
        : { id: idNum };

      where = {
        OR: [
          idCondition,
          { resident: { name: { contains: search, mode: "insensitive" } } },
          { vehicle: { plate: { contains: search, mode: "insensitive" } } },
        ].filter((cond): cond is Prisma.AccessLogWhereInput => Boolean(cond)),
      };
    }

    const [data, total] = await Promise.all([
      prisma.accessLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { entryDatetime: "desc" },
        include: {
          resident: true,
          vehicle: true,
        },
      }),
      prisma.accessLog.count({ where }),
    ]);

    return {
      data: data.map((a) =>
        AccessLog.fromPrimitives({
          id: a.id,
          residentId: a.residentId,
          vehicleId: a.vehicleId,
          entryDatetime: a.entryDatetime,
          exitDatetime: a.exitDatetime,
          createdAt: a.createdAt,
        }),
      ),
      total,
    };
  }

  async findById(id: number): Promise<AccessLog | null> {
    const data = await prisma.accessLog.findUnique({ where: { id } });
    if (!data) return null;
    return AccessLog.fromPrimitives(data);
  }

  async create(accessLog: AccessLog): Promise<AccessLog> {
    const data = await prisma.accessLog.create({
      data: {
        residentId: accessLog.residentId,
        vehicleId: accessLog.vehicleId,
        entryDatetime: accessLog.entryDatetime,
        exitDatetime: accessLog.exitDatetime,
      },
    });
    return AccessLog.fromPrimitives(data);
  }

  async update(id: number, accessLog: Partial<AccessLog>): Promise<AccessLog> {
    const data = await prisma.accessLog.update({
      where: { id },
      data: {
        residentId: accessLog.residentId,
        vehicleId: accessLog.vehicleId,
        entryDatetime: accessLog.entryDatetime,
        exitDatetime: accessLog.exitDatetime,
      },
    });
    return AccessLog.fromPrimitives(data);
  }

  async delete(id: number): Promise<void> {
    await prisma.accessLog.delete({ where: { id } });
  }

  async registerExit(id: number, exitDatetime: Date): Promise<void> {
    await prisma.accessLog.update({
      where: { id },
      data: { exitDatetime },
    });
  }

  async getRecent(limit: number = 10): Promise<AccessLog[]> {
    const data = await prisma.accessLog.findMany({
      orderBy: { entryDatetime: "desc" },
      take: limit,
      include: {
        resident: true,
        vehicle: true,
      },
    });
    return data.map((a) =>
      AccessLog.fromPrimitives({
        id: a.id,
        residentId: a.residentId,
        vehicleId: a.vehicleId,
        entryDatetime: a.entryDatetime,
        exitDatetime: a.exitDatetime,
        createdAt: a.createdAt,
      }),
    );
  }

  // Consultas raw adaptadas a PostgreSQL

  async getAccessesPerDay(
    startDate: Date,
    endDate: Date,
  ): Promise<{ date: string; count: number }[]> {
    const results = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT DATE("entry_datetime")::text as date, COUNT(*) as count
      FROM "AccessLog"
      WHERE "entry_datetime" >= ${startDate} AND "entry_datetime" <= ${endDate}
      GROUP BY DATE("entry_datetime")
      ORDER BY date
    `;
    return results.map((r) => ({ date: r.date, count: Number(r.count) }));
  }

  async getAccessesPerResident(
    startDate: Date,
    endDate: Date,
  ): Promise<{ name: string; count: number }[]> {
    const results = await prisma.$queryRaw<{ name: string; count: bigint }[]>`
      SELECT COALESCE(r."name", 'Sin Residente') as name, COUNT(a."id") as count
      FROM "AccessLog" a
      LEFT JOIN "Resident" r ON a."resident_id" = r."id"
      WHERE a."entry_datetime" >= ${startDate} AND a."entry_datetime" <= ${endDate}
      GROUP BY r."id", r."name"
      ORDER BY count DESC
      LIMIT 10
    `;
    return results.map((r) => ({ name: r.name, count: Number(r.count) }));
  }

  async getAccessStatusCounts(): Promise<{ status: string; count: number }[]> {
    const results = await prisma.$queryRaw<{ status: string; count: bigint }[]>`
      SELECT 
        CASE WHEN "exit_datetime" IS NULL THEN 'pending' ELSE 'completed' END as status,
        COUNT(*) as count
      FROM "AccessLog"
      GROUP BY CASE WHEN "exit_datetime" IS NULL THEN 'pending' ELSE 'completed' END
    `;
    return results.map((r) => ({ status: r.status, count: Number(r.count) }));
  }

  async getLast7Days(): Promise<{ date: string; count: number }[]> {
    const results = await prisma.$queryRaw<{ date: string; count: bigint }[]>`
      SELECT DATE("entry_datetime")::text as date, COUNT(*) as count
      FROM "AccessLog"
      WHERE "entry_datetime" >= (CURRENT_DATE - INTERVAL '7 days')
      GROUP BY DATE("entry_datetime")
      ORDER BY date
    `;
    return results.map((r) => ({ date: r.date, count: Number(r.count) }));
  }

  async getFiltered(
    filters: ReportFiltersDto,
    page: number = 1,
    limit: number = 20,
  ) {
    const skip = (page - 1) * limit;
    const where: Prisma.AccessLogWhereInput = {};

    if (filters.startDate) {
      where.entryDatetime = {
        ...(typeof where.entryDatetime === "object" ? where.entryDatetime : {}),
        gte: filters.startDate,
      };
    }
    if (filters.endDate) {
      where.entryDatetime = {
        ...(typeof where.entryDatetime === "object" ? where.entryDatetime : {}),
        lte: filters.endDate,
      };
    }
    if (filters.residentId) {
      where.residentId = filters.residentId;
    }
    if (filters.vehiclePlate) {
      where.vehicle = {
        plate: { contains: filters.vehiclePlate, mode: "insensitive" },
      };
    }

    const [data, total] = await Promise.all([
      prisma.accessLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { entryDatetime: "desc" },
        include: {
          resident: true,
          vehicle: true,
        },
      }),
      prisma.accessLog.count({ where }),
    ]);

    return {
      data: data.map((a) =>
        AccessLog.fromPrimitives({
          id: a.id,
          residentId: a.residentId,
          vehicleId: a.vehicleId,
          entryDatetime: a.entryDatetime,
          exitDatetime: a.exitDatetime,
          createdAt: a.createdAt,
        }),
      ),
      total,
    };
  }
}
