export interface UpdateAccessLogDto {
  residentId?: number | null;
  vehicleId?: number | null;
  entryDatetime?: Date;
  exitDatetime?: Date | null;
}
