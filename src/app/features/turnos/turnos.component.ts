import { Component, DestroyRef, OnInit, inject, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  TurnosService,
  CreateBookingRequest,
  AvailableSlot
} from '../../shared/services/turnos.service';
import { SlotPickerComponent } from '../../shared/components/slot-picker/slot-picker.component';
import { ResizedImage, resizeImage } from '../../shared/utils/image-resize';
import { formatDisplayDateTime, formatDuration, tomorrowIso } from '../../shared/utils/dates';
import { apiErrorMessage } from '../../shared/utils/api-error';

interface SubmittedRequest {
  clientName: string;
  clientEmail: string;
  startLocal: string;
  durationMinutes: number;
  manageId: string;
  manageToken: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_REFERENCES = 3;
const STUDIO_TIME_ZONE = 'America/Argentina/Buenos_Aires';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [FormsModule, RouterLink, SlotPickerComponent],
  templateUrl: './turnos.component.html',
  styleUrls: ['./turnos.component.css']
})
export class TurnosComponent implements OnInit {
  private readonly turnosService = inject(TurnosService);
  private readonly slotPicker = viewChild(SlotPickerComponent);
  private toastTimer?: ReturnType<typeof setTimeout>;

  turno = this.emptyForm();

  selectedDate = '';
  selectedSlot: AvailableSlot | null = null;
  minDate = '';

  references: ResizedImage[] = [];
  isProcessingImages = false;

  toastMessage = '';
  showToast = false;
  isErrorToast = false;
  isSubmitting = false;

  submitted: SubmittedRequest | null = null;

  readonly maxReferences = MAX_REFERENCES;
  readonly formatDisplayDateTime = formatDisplayDateTime;
  readonly formatDuration = formatDuration;

  readonly durationOptions = [
    { label: '1 hora', value: 60 },
    { label: '2 horas', value: 120 },
    { label: '3 horas', value: 180 }
  ];

  readonly bodyZones = [
    'Antebrazo',
    'Brazo',
    'Hombro',
    'Mano / dedos',
    'Pierna',
    'Pantorrilla',
    'Tobillo / pie',
    'Espalda',
    'Pecho',
    'Costillas',
    'Abdomen',
    'Cuello / nuca',
    'Otra / no sé todavía'
  ];

  readonly sizes = [
    'Chico (hasta 5 cm)',
    'Mediano (5–15 cm)',
    'Grande (15–25 cm)',
    'Muy grande (más de 25 cm)',
    'No sé, lo vemos juntos'
  ];

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.toastTimer));
  }

  ngOnInit(): void {
    this.minDate = tomorrowIso();
    this.selectedDate = this.minDate;
  }

  onSlotChange(slot: AvailableSlot | null): void {
    this.selectedSlot = slot;
    if (slot) this.submitted = null;
  }

  async onReferencesSelected(event: Event): Promise<void> {
    const inputEl = event.target as HTMLInputElement;
    const files = Array.from(inputEl.files ?? []);
    inputEl.value = ''; // permite volver a elegir el mismo archivo

    const room = MAX_REFERENCES - this.references.length;
    if (files.length > room) {
      this.mostrarToast(`Podés adjuntar hasta ${MAX_REFERENCES} fotos.`, true);
    }

    this.isProcessingImages = true;
    try {
      for (const file of files.slice(0, Math.max(room, 0))) {
        this.references = [...this.references, await resizeImage(file)];
      }
    } catch {
      this.mostrarToast('No se pudo leer una de las fotos. Probá con otra (JPG o PNG).', true);
    } finally {
      this.isProcessingImages = false;
    }
  }

  removeReference(index: number): void {
    this.references = this.references.filter((_, i) => i !== index);
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
      notes: this.turno.descripcion?.trim() || null,
      bodyZone: this.turno.zona || null,
      size: this.turno.tamano || null,
      references: this.references.map(({ fileName, contentType, dataBase64 }) => ({
        fileName,
        contentType,
        dataBase64
      }))
    };

    this.isSubmitting = true;

    this.turnosService.crearTurno(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;

        const manage = new URL(res.manageUrl);
        this.submitted = {
          clientName: payload.clientName,
          clientEmail: payload.clientEmail,
          startLocal: payload.startLocal,
          durationMinutes: payload.durationMinutes,
          manageId: manage.searchParams.get('id') ?? res.eventId,
          manageToken: manage.searchParams.get('token') ?? ''
        };

        this.turno = this.emptyForm();
        this.references = [];
        this.selectedSlot = null;
        this.slotPicker()?.reload();
        this.mostrarToast('Solicitud enviada. Te llega un mail con los detalles.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.mostrarToast(apiErrorMessage(err, 'No se pudo enviar la solicitud.'), true);

        // Si el horario se ocupó mientras tanto, refrescamos la lista.
        if (err?.status === 409) {
          this.selectedSlot = null;
          this.slotPicker()?.reload();
        }
      }
    });
  }

  get isEmailValid(): boolean {
    return EMAIL_PATTERN.test(this.turno.email.trim());
  }

  get canSubmit(): boolean {
    return (
      !!this.turno.nombre.trim() &&
      this.isEmailValid &&
      !!this.selectedSlot &&
      !this.isSubmitting &&
      !this.isProcessingImages
    );
  }

  /** Link para agendar la solicitud en el Google Calendar del cliente (en hora de Argentina). */
  getGoogleCalendarUrl(): string {
    if (!this.submitted) return '';

    const start = this.submitted.startLocal;
    const end = this.addMinutes(start, this.submitted.durationMinutes);
    const compact = (v: string) => v.replace(/[-:]/g, '');

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: 'Turno de tatuaje (a confirmar) – Mnk Ink',
      dates: `${compact(start)}/${compact(end)}`,
      ctz: STUDIO_TIME_ZONE,
      details:
        `Solicitud de turno en Mnk Ink. Se confirma al coordinar diseño, presupuesto y seña.\n` +
        `Duración estimada: ${formatDuration(this.submitted.durationMinutes)}.`,
      location: 'Mnk Ink, Tandil'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  private addMinutes(localIso: string, minutes: number): string {
    // Sumamos sobre la hora "de pared" (sin zona) para no depender del huso del navegador.
    const [date, time] = localIso.split('T');
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);
    const t = new Date(Date.UTC(y, m - 1, d, hh, mm + minutes));
    return t.toISOString().slice(0, 19);
  }

  private emptyForm() {
    return {
      nombre: '',
      email: '',
      telefono: '',
      descripcion: '',
      zona: '',
      tamano: '',
      duracionMinutos: 120
    };
  }

  mostrarToast(mensaje: string, error = false): void {
    this.toastMessage = mensaje;
    this.isErrorToast = error;
    this.showToast = true;

    // Reiniciamos el contador para que un aviso nuevo no se cierre antes de tiempo.
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.showToast = false;
    }, 4000);
  }
}
