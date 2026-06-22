export interface CreateResidentDto {
  name: string;
  dni: string;
  status?: "active" | "inactive";
}
