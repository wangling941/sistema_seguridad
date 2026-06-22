import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AccessLog,
  AuthResponse,
  CountByDate,
  CountByName,
  CountByStatus,
  PaginatedResponse,
  Resident,
  Vehicle,
  Visitor,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, {
      username,
      password,
    });
  }

  getResidents(
    search = '',
    page = 1,
    limit = 20,
  ): Observable<PaginatedResponse<Resident>> {
    return this.http.get<PaginatedResponse<Resident>>(
      `${this.baseUrl}/residents`,
      {
        params: this.listParams(search, page, limit),
      },
    );
  }

  createResident(data: Partial<Resident>): Observable<Resident> {
    return this.http.post<Resident>(`${this.baseUrl}/residents`, data);
  }

  updateResident(id: number, data: Partial<Resident>): Observable<Resident> {
    return this.http.put<Resident>(`${this.baseUrl}/residents/${id}`, data);
  }

  deleteResident(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/residents/${id}`);
  }

  getResidentStatusCounts(): Observable<CountByStatus[]> {
    return this.http.get<CountByStatus[]>(
      `${this.baseUrl}/residents/status-counts`,
    );
  }

  getVehicles(
    search = '',
    page = 1,
    limit = 20,
  ): Observable<PaginatedResponse<Vehicle>> {
    return this.http.get<PaginatedResponse<Vehicle>>(
      `${this.baseUrl}/vehicles`,
      {
        params: this.listParams(search, page, limit),
      },
    );
  }

  createVehicle(data: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.baseUrl}/vehicles`, data);
  }

  updateVehicle(id: number, data: Partial<Vehicle>): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/vehicles/${id}`, data);
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/vehicles/${id}`);
  }

  getVehiclesPerResident(): Observable<CountByName[]> {
    return this.http.get<CountByName[]>(
      `${this.baseUrl}/vehicles/per-resident`,
    );
  }

  getVisitors(
    search = '',
    page = 1,
    limit = 20,
  ): Observable<PaginatedResponse<Visitor>> {
    return this.http.get<PaginatedResponse<Visitor>>(
      `${this.baseUrl}/visitors`,
      {
        params: this.listParams(search, page, limit),
      },
    );
  }

  createVisitor(data: Partial<Visitor>): Observable<Visitor> {
    return this.http.post<Visitor>(`${this.baseUrl}/visitors`, data);
  }

  updateVisitor(id: number, data: Partial<Visitor>): Observable<Visitor> {
    return this.http.put<Visitor>(`${this.baseUrl}/visitors/${id}`, data);
  }

  deleteVisitor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/visitors/${id}`);
  }

  getVisitorStatusCounts(): Observable<CountByStatus[]> {
    return this.http.get<CountByStatus[]>(
      `${this.baseUrl}/visitors/status-counts`,
    );
  }

  getAccessLogs(
    search = '',
    page = 1,
    limit = 20,
  ): Observable<PaginatedResponse<AccessLog>> {
    return this.http.get<PaginatedResponse<AccessLog>>(
      `${this.baseUrl}/access-logs`,
      {
        params: this.listParams(search, page, limit),
      },
    );
  }

  createAccessLog(data: Partial<AccessLog>): Observable<AccessLog> {
    return this.http.post<AccessLog>(`${this.baseUrl}/access-logs`, data);
  }

  updateAccessLog(id: number, data: Partial<AccessLog>): Observable<AccessLog> {
    return this.http.put<AccessLog>(`${this.baseUrl}/access-logs/${id}`, data);
  }

  deleteAccessLog(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/access-logs/${id}`);
  }

  registerExit(id: number): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.baseUrl}/access-logs/${id}/exit`,
      {},
    );
  }

  getRecentAccessLogs(limit = 10): Observable<AccessLog[]> {
    return this.http.get<AccessLog[]>(`${this.baseUrl}/access-logs/recent`, {
      params: new HttpParams().set('limit', limit),
    });
  }

  getAccessStatusCounts(): Observable<CountByStatus[]> {
    return this.http.get<CountByStatus[]>(
      `${this.baseUrl}/access-logs/status-counts`,
    );
  }

  getAccessLast7Days(): Observable<CountByDate[]> {
    return this.http.get<CountByDate[]>(
      `${this.baseUrl}/access-logs/last7days`,
    );
  }

  getReport(params: {
    startDate?: string;
    endDate?: string;
    residentId?: number | null;
    vehiclePlate?: string;
    page?: number;
    limit?: number;
  }): Observable<PaginatedResponse<AccessLog>> {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });
    return this.http.get<PaginatedResponse<AccessLog>>(
      `${this.baseUrl}/reports`,
      {
        params: httpParams,
      },
    );
  }

  private listParams(search: string, page: number, limit: number): HttpParams {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return params;
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, {
      username,
      password,
    });
  }
}
