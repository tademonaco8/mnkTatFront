import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AvailableSlot, ManagedBooking, TurnosService } from '../../shared/services/turnos.service';
import { SlotPickerComponent } from '../../shared/components/slot-picker/slot-picker.component';
import { formatDisplayDateTime, formatDuration, tomorrowIso } from '../../shared/utils/dates';
import { apiErrorMessage } from '../../shared/utils/api-error';
import { whatsappLink } from '../../shared/studio';
import { AnalyticsService } from '../../shared/services/analytics.service';

type Mode = 'view' | 'cancel' | 'reschedule';
type State = 'loading' | 'ready' | 'not-found' | 'cancelled';

/** Página a la que lleva el link del mail: ver, cancelar o cambiar el horario del turno. */
@Component({
  selector: 'app-gestionar-turno',
  standalone: true,
  imports: [FormsModule, RouterLink, SlotPickerComponent],
  templateUrl: './gestionar-turno.component.html',
  styleUrl: './gestionar-turno.component.css'
})
export class GestionarTurnoComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly turnosService = inject(TurnosService);
  private readonly analytics = inject(AnalyticsService);

  protected readonly state = signal<State>('loading');
  protected readonly mode = signal<Mode>('view');
  protected readonly booking = signal<ManagedBooking | null>(null);
  protected readonly busy = signal(false);
  protected readonly message = signal<{ text: string; error: boolean } | null>(null);

  protected newDate = tomorrowIso();
  protected newSlot: AvailableSlot | null = null;
  protected readonly minDate = tomorrowIso();

  protected readonly formatDisplayDateTime = formatDisplayDateTime;
  protected readonly formatDuration = formatDuration;
  protected readonly whatsapp = whatsappLink('Hola! Quiero hacer un cambio en mi turno.');

  private id = '';
  private token = '';

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.id = params.get('id') ?? '';
    this.token = params.get('token') ?? '';

    if (!this.id || !this.token) {
      this.state.set('not-found');
      return;
    }

    this.turnosService.obtenerTurno(this.id, this.token).subscribe({
      next: (b) => {
        this.booking.set(b);
        this.newDate = b.start.slice(0, 10);
        this.state.set('ready');
      },
      error: () => this.state.set('not-found')
    });
  }

  protected setMode(mode: Mode): void {
    this.mode.set(mode);
    this.message.set(null);
    this.newSlot = null;
  }

  protected confirmCancel(): void {
    this.busy.set(true);
    this.turnosService.cancelarTurno(this.id, this.token).subscribe({
      next: () => {
        this.busy.set(false);
        this.state.set('cancelled');
        this.analytics.track('turno-cancelado');
      },
      error: (err) => {
        this.busy.set(false);
        this.message.set({ text: apiErrorMessage(err, 'No se pudo cancelar el turno.'), error: true });
      }
    });
  }

  protected confirmReschedule(): void {
    if (!this.newSlot) return;

    this.busy.set(true);
    this.turnosService.reprogramarTurno(this.id, this.token, this.newSlot.start).subscribe({
      next: (b) => {
        this.busy.set(false);
        this.booking.set(b);
        this.analytics.track('turno-reprogramado');
        this.mode.set('view');
        this.newSlot = null;
        this.message.set({ text: 'Listo, cambiaste el horario. Te mandamos un mail con el nuevo turno.', error: false });
      },
      error: (err) => {
        this.busy.set(false);
        this.message.set({ text: apiErrorMessage(err, 'No se pudo cambiar el horario.'), error: true });
      }
    });
  }
}
