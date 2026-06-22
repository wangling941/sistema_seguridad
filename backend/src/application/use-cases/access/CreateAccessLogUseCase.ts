import { IAccessLogRepository } from "../../ports/repositories/IAccessLogRepository";
import { CreateAccessLogDto } from "../../dto/CreateAccessLogDto";
import { AccessLog } from "../../../domain/entities/AccessLog";
import { IEventEmitter } from "../../ports/services/IEventEmitter";

export class CreateAccessLogUseCase {
  constructor(
    private accessLogRepository: IAccessLogRepository,
    private eventEmitter: IEventEmitter,
  ) {}

  async execute(dto: CreateAccessLogDto): Promise<AccessLog> {
    const accessLog = new AccessLog(
      undefined,
      dto.residentId || null,
      dto.vehicleId || null,
      dto.entryDatetime || new Date(),
    );

    const created = await this.accessLogRepository.create(accessLog);

    // Emitir evento para notificaciones
    this.eventEmitter.emit("access.created", {
      accessLogId: created.id,
      residentId: created.residentId,
      vehicleId: created.vehicleId,
      entryDatetime: created.entryDatetime,
    });

    return created;
  }
}
