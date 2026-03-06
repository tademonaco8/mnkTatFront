import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateBookingRequest {
  clientName: string;
  clientEmail: string;
  phone?: string | null;
  startLocal: string;
  durationMinutes: number;
  notes?: string | null;
}

export interface CreateBookingResponse {
  eventId: string;
  htmlLink: string;
}

export interface BusySlotResponse {
  start: string | null;
  end: string | null;
}

@Injectable({ providedIn: 'root' })
export class TurnosService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api/bookings`;
  private readonly availabilityUrl = `${environment.apiBaseUrl}/api/availability`;

  constructor(private http: HttpClient) {}

  crearTurno(payload: CreateBookingRequest): Observable<CreateBookingResponse> {
    return this.http.post<CreateBookingResponse>(this.apiUrl, payload);
  }

  obtenerTurnosDelDia(day: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?day=${day}`);
  }

  obtenerDisponibilidad(day: string): Observable<BusySlotResponse[]> {
    return this.http.get<BusySlotResponse[]>(`${this.availabilityUrl}?day=${day}`);
  }
}