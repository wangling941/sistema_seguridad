export interface UpdateResidentDto {
  name?: string;
  dni?: string;
  status?: "active" | "inactive";
}
