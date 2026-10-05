import { Injectable, inject } from '@angular/core';
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

/** Un horario del día, tal como lo devuelve el backend (hora local del estudio). */
export interface AvailableSlot {
  start: string; // "2026-10-17T15:00:00"
  end: string;
  available: boolean;
}

export interface AvailabilityResponse {
  date: string;
  durationMinutes: number;
  allowedDurations: number[];
  slots: AvailableSlot[];
}

@Injectable({ providedIn: 'root' })
export class TurnosService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiBaseUrl}/api/bookings`;
  private readonly availabilityUrl = `${environment.apiBaseUrl}/api/availability/slots`;

  crearTurno(payload: CreateBookingRequest): Observable<CreateBookingResponse> {
    return this.http.post<CreateBookingResponse>(this.apiUrl, payload);
  }

  /** Horarios habilitados del día con su disponibilidad para la duración elegida. */
  obtenerHorarios(day: string, durationMinutes: number): Observable<AvailabilityResponse> {
    return this.http.get<AvailabilityResponse>(this.availabilityUrl, {
      params: { day, durationMinutes }
    });
  }
}