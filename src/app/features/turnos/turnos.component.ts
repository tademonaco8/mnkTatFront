import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {
  TurnosService,
  CreateBookingRequest,
  AvailableSlot
} from '../../shared/services/turnos.service';

interface BookingConfirmation {
  clientName: string;
  clientEmail: string;
  startLocal: string;
  durationMinutes: number;
  notes?: string | null;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Después de este tiempo cargando, avisamos que el servidor puede estar "despertando" (Render free). */
const SLOW_LOADING_MS = 4000;

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
  private readonly turnosService = inject(TurnosService);

  private availabilitySub?: Subscription;
  private toastTimer?: ReturnType<typeof setTimeout>;
  private slowLoadingTimer?: ReturnType<typeof setTimeout>;

  turno = {
    nombre: '',
    email: '',
    telefono: '',
    descripcion: '',
    duracionMinutos: 120
  };

  selectedDate = '';
  availableSlots: AvailableSlot[] = [];
  availabilityError = false;
  selectedSlot: AvailableSlot | null = null;

  toastMessage = '';
  showToast = false;
  isErrorToast = false;

  isLoadingAvailability = false;
  isSlowLoading = false;
  isSubmitting = false;

  minDate = '';

  successBooking: BookingConfirmation | null = null;

  readonly durationOptions = [
    { label: '1 hora', value: 60 },
    { label: '2 horas', value: 120 },
    { label: '3 horas', value: 180 }
  ];

  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.availabilitySub?.unsubscribe();
      clearTimeout(this.toastTimer);
      clearTimeout(this.slowLoadingTimer);
    });
  }

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
    this.loadAvailability();
  }

  loadAvailability(): void {
    if (!this.selectedDate) {
      this.availableSlots = [];
      return;
    }

    // Si el usuario cambia de fecha rápido, cancelamos la consulta anterior
    // para que una respuesta vieja no pise a la nueva.
    this.availabilitySub?.unsubscribe();
    this.setLoadingAvailability(true);

    this.availabilityError = false;

    this.availabilitySub = this.turnosService
      .obtenerHorarios(this.selectedDate, this.turno.duracionMinutos)
      .subscribe({
        next: (res) => {
          // Los horarios vienen del backend (appsettings.json → Schedule).
          this.availableSlots = res.slots ?? [];
          this.setLoadingAvailability(false);
        },
        error: () => {
          this.availableSlots = [];
          this.availabilityError = true;
          this.setLoadingAvailability(false);
          this.mostrarToast('No se pudo consultar la disponibilidad.', true);
        }
      });
  }

  selectSlot(slot: AvailableSlot): void {
    if (!slot.available) return;

    this.selectedSlot = slot;
    this.successBooking = null;
  }

  enviarTurno(): void {
    if (!this.turno.nombre.trim() || !this.turno.email.trim()) {
      this.mostrarToast('Completá nombre y email.', true);
      return;
    }

    if (!this.isEmailValid) {
      this.mostrarToast('Revisá el email, parece tener un error.', true);
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
      startLocal: this.selectedSlot.start,
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
        this.mostrarToast(this.getErrorMessage(err), true);

        // Si el horario se ocupó mientras tanto, refrescamos la lista.
        if (err?.status === 409) {
          this.selectedSlot = null;
          this.loadAvailability();
        }
      }
    });
  }

  get isEmailValid(): boolean {
    return EMAIL_PATTERN.test(this.turno.email.trim());
  }

  get canSubmit(): boolean {
    return !!this.turno.nombre.trim() && this.isEmailValid && !!this.selectedSlot && !this.isSubmitting;
  }

  /** "2026-10-17T15:00:00" → "15:00" */
  formatHour(value: string): string {
    return value.slice(11, 16);
  }

  formatDisplayDateTime(value: string): string {
    const date = new Date(value);
    return new Intl.DateTimeFormat('es-AR', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(date);
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

  /** Toma el mensaje que manda el backend (error simple o de validación). */
  private getErrorMessage(err: any): string {
    const validation = err?.error?.errors as Record<string, string[]> | undefined;
    const firstValidation = validation ? Object.values(validation).flat()[0] : undefined;
    return err?.error?.message || firstValidation || 'No se pudo crear el turno.';
  }

  private mostrarToast(mensaje: string, error: boolean = false): void {
    this.toastMessage = mensaje;
    this.isErrorToast = error;
    this.showToast = true;

    // Reiniciamos el contador para que un aviso nuevo no se cierre antes de tiempo.
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  private setLoadingAvailability(loading: boolean): void {
    this.isLoadingAvailability = loading;
    this.isSlowLoading = false;
    clearTimeout(this.slowLoadingTimer);

    if (loading) {
      this.slowLoadingTimer = setTimeout(() => {
        this.isSlowLoading = true;
      }, SLOW_LOADING_MS);
    }
  }

  getGoogleCalendarUrl(): string {
    if (!this.successBooking) return '';

    const title = encodeURIComponent('Turno Tatuaje - Mnk Ink');
    const details = encodeURIComponent(
      `Turno agendado en Mnk Ink.\nDuración estimada: ${this.successBooking.durationMinutes / 60} h.\nRecordá venir bien descansado/a y comido/a.`
    );

    const startDate = new Date(this.successBooking.startLocal);
    const endDate = new Date(startDate.getTime() + this.successBooking.durationMinutes * 60000);

    const formatGCalDate = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const startStr = formatGCalDate(startDate);
    const endStr = formatGCalDate(endDate);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=Mnk+Ink+Studio`;
  }
}