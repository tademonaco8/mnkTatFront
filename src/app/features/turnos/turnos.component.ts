import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  TurnosService,
  CreateBookingRequest,
  BusySlotResponse
} from '../../shared/services/turnos.service';

interface AvailableSlot {
  label: string;
  startLocal: string;
  endLocal: string;
  available: boolean;
}

interface BookingConfirmation {
  clientName: string;
  clientEmail: string;
  startLocal: string;
  durationMinutes: number;
  notes?: string | null;
}

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
  turno = {
    nombre: '',
    email: '',
    telefono: '',
    descripcion: '',
    duracionMinutos: 120
  };

  selectedDate = '';
  busySlots: BusySlotResponse[] = [];
  availableSlots: AvailableSlot[] = [];
  selectedSlot: AvailableSlot | null = null;

  toastMessage = '';
  showToast = false;
  isErrorToast = false;

  isLoadingAvailability = false;
  isSubmitting = false;

  minDate = '';

  successBooking: BookingConfirmation | null = null;

  readonly durationOptions = [
    { label: '1 hora', value: 60 },
    { label: '2 horas', value: 120 },
    { label: '3 horas', value: 180 }
  ];

  readonly allowedSlotsByDay: { [key: number]: string[] } = {
    // 0 = domingo
    // 1 = lunes
    // 2 = martes
    // 3 = miércoles
    // 4 = jueves
    // 5 = viernes
    // 6 = sábado

    2: ['18:30', '20:00'],          // martes
    4: ['18:30', '20:00'],          // jueves
    6: ['10:00', '12:30', '15:00']  // sábado
  };

  constructor(private turnosService: TurnosService) {}

  ngOnInit(): void {
    this.minDate = this.getTomorrowDate();
    this.selectedDate = this.minDate;
    this.loadAvailability();
  }

  onDateChange(): void {
    this.selectedSlot = null;
    this.successBooking = null;
    this.loadAvailability();
  }

  onDurationChange(): void {
    this.selectedSlot = null;
    this.successBooking = null;
    this.generateSlots();
  }

  loadAvailability(): void {
    if (!this.selectedDate) {
      this.availableSlots = [];
      return;
    }

    this.isLoadingAvailability = true;

    this.turnosService.obtenerDisponibilidad(this.selectedDate).subscribe({
      next: (busy) => {
        this.busySlots = busy || [];
        this.generateSlots();
        this.isLoadingAvailability = false;
      },
      error: () => {
        this.busySlots = [];
        this.generateSlots();
        this.isLoadingAvailability = false;
        this.mostrarToast('No se pudo consultar la disponibilidad.', true);
      }
    });
  }

  generateSlots(): void {
  if (!this.selectedDate) {
    this.availableSlots = [];
    return;
  }

  const allowedSlots = this.getAllowedSlotsForSelectedDate();

  if (allowedSlots.length === 0) {
    this.availableSlots = [];
    return;
  }

  const slots: AvailableSlot[] = [];
  const durationMs = this.turno.duracionMinutos * 60 * 1000;

  allowedSlots.forEach((slotTime) => {
    const [hours, minutes] = slotTime.split(':').map(Number);

    const startDate = this.buildDate(this.selectedDate, hours, minutes);
    const endDate = new Date(startDate.getTime() + durationMs);

    const available = !this.busySlots.some((busy) =>
      this.overlapsWithBusySlot(startDate, endDate, busy)
    );

    slots.push({
      label: `${this.formatHour(startDate)} - ${this.formatHour(endDate)}`,
      startLocal: this.toLocalDateTimeString(startDate),
      endLocal: this.toLocalDateTimeString(endDate),
      available
    });
  });

  this.availableSlots = slots;
}

  selectSlot(slot: AvailableSlot): void {
    if (!slot.available) return;

    this.selectedSlot = slot;
    this.successBooking = null;
  }

  enviarTurno(): void {
    if (!this.turno.nombre || !this.turno.email) {
      this.mostrarToast('Completá nombre y email.', true);
      return;
    }

    if (!this.selectedSlot) {
      this.mostrarToast('Seleccioná un horario disponible.', true);
      return;
    }

    const payload: CreateBookingRequest = {
      clientName: this.turno.nombre.trim(),
      clientEmail: this.turno.email.trim(),
      phone: this.turno.telefono?.trim() || null,
      startLocal: this.selectedSlot.startLocal,
      durationMinutes: this.turno.duracionMinutos,
      notes: this.turno.descripcion?.trim() || null
    };

    this.isSubmitting = true;

    this.turnosService.crearTurno(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        this.successBooking = {
          clientName: payload.clientName,
          clientEmail: payload.clientEmail,
          startLocal: payload.startLocal,
          durationMinutes: payload.durationMinutes,
          notes: payload.notes
        };

        this.turno = {
          nombre: '',
          email: '',
          telefono: '',
          descripcion: '',
          duracionMinutos: 120
        };

        this.selectedSlot = null;
        this.loadAvailability();
        this.mostrarToast('Solicitud registrada correctamente.');
      },
      error: (err) => {
        this.isSubmitting = false;
        const mensaje = err?.error?.message || 'No se pudo crear el turno.';
        this.mostrarToast(mensaje, true);
      }
    });
  }

  get canSubmit(): boolean {
    return !!this.turno.nombre && !!this.turno.email && !!this.selectedSlot && !this.isSubmitting;
  }

  formatDisplayDateTime(value: string): string {
    const date = new Date(value);
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(date);
  }

  private overlapsWithBusySlot(start: Date, end: Date, busy: BusySlotResponse): boolean {
    if (!busy.start || !busy.end) return false;

    const busyStart = new Date(busy.start);
    const busyEnd = new Date(busy.end);

    return start < busyEnd && end > busyStart;
  }

  private buildDate(dateStr: string, hours: number, minutes: number): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day, hours, minutes, 0, 0);
  }
  
  private getAllowedSlotsForSelectedDate(): string[] {
  if (!this.selectedDate) return [];

  const [year, month, day] = this.selectedDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();

  return this.allowedSlotsByDay[dayOfWeek] || [];
}

  private toLocalDateTimeString(date: Date): string {
    const year = date.getFullYear();
    const month = this.pad(date.getMonth() + 1);
    const day = this.pad(date.getDate());
    const hours = this.pad(date.getHours());
    const minutes = this.pad(date.getMinutes());
    const seconds = this.pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

  private formatHour(date: Date): string {
    return `${this.pad(date.getHours())}:${this.pad(date.getMinutes())}`;
  }

  private pad(value: number): string {
    return value.toString().padStart(2, '0');
  }

  private getTomorrowDate(): string {
    const today = new Date();
    today.setDate(today.getDate() + 1);

    const year = today.getFullYear();
    const month = this.pad(today.getMonth() + 1);
    const day = this.pad(today.getDate());

    return `${year}-${month}-${day}`;
  }

  private mostrarToast(mensaje: string, error: boolean = false): void {
    this.toastMessage = mensaje;
    this.isErrorToast = error;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}