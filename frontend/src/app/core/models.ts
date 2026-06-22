export type Status = 'active' | 'inactive';

export interface User {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Resident {
  id: number;
  name: string;
  dni: string;
  status: Status;
  createdAt: string;
}

export interface Vehicle {
  id: number;
  plate: string;
  residentId: number | null;
  createdAt: string;
}

export interface Visitor {
  id: number;
  name: string;
  dni: string;
  hasVehicle: boolean;
  vehiclePlate: string | null;
  companionsCount: number | null;
  status: Status;
  lastEntry: string | null;
  lastExit: string | null;
  createdAt: string;
}

export interface AccessLog {
  id: number;
  residentId: number | null;
  vehicleId: number | null;
  entryDatetime: string;
  exitDatetime: string | null;
  createdAt: string;
}

export interface CountByStatus {
  status: string;
  count: number;
}

export interface CountByName {
  name: string;
  count: number;
}

export interface CountByDate {
  date: string;
  count: number;
}

export interface RealtimeNotification {
  type: string;
  payload: unknown;
  receivedAt: string;
}
