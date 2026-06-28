import { IAccessLogRepository } from "../../ports/repositories/IAccessLogRepository";
import { CreateAccessLogDto } from "../../dto/CreateAccessLogDto";
import { AccessLog } from "../../../domain/entities/AccessLog";
import { IEventEmitter } from "../../ports/services/IEventEmitter";
import { ValidationError } from "../../../domain/exceptions/DomainError";

export class CreateAccessLogUseCase {
  constructor(
    private accessLogRepository: IAccessLogRepository,
    private eventEmitter: IEventEmitter,
  ) {}

  async execute(dto: CreateAccessLogDto): Promise<AccessLog> {
    // VALIDACIÓN: Debe tener al menos un ID (residente, vehículo o visitante)
    if (!dto.residentId && !dto.vehicleId && !dto.visitorId) {
      throw new ValidationError(
        "Debe proporcionar al menos un residente, vehículo o visitante",
      );
    }

    const accessLog = new AccessLog(
      undefined,
      dto.residentId || null,
      dto.vehicleId || null,
      dto.visitorId || null,
      dto.entryDatetime || new Date(),
    );

    const created = await this.accessLogRepository.create(accessLog);

    this.eventEmitter.emit("access.created", {
      accessLogId: created.id,
      residentId: created.residentId,
      vehicleId: created.vehicleId,
      visitorId: created.visitorId,
      entryDatetime: created.entryDatetime,
    });

    return created;
  }
}
