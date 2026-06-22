export interface CreateVisitorDto {
  name: string;
  dni: string;
  hasVehicle?: boolean;
  vehiclePlate?: string | null;
  companionsCount?: number | null;
  status?: "active" | "inactive";
  lastEntry?: Date | null;
  lastExit?: Date | null;
}
