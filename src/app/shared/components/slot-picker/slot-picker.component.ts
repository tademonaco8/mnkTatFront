import { Component, DestroyRef, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { Subscription } from 'rxjs';
import { AvailableSlot, TurnosService } from '../../services/turnos.service';
import { formatHour } from '../../utils/dates';

/** Después de este tiempo cargando, avisamos que el servidor puede estar "despertando" (Render free). */
const SLOW_LOADING_MS = 4000;

/**
 * Lista de horarios de un día con su disponibilidad (vienen del backend).
 * Se usa al solicitar un turno y al cambiar el horario de uno existente.
 */
@Component({
  selector: 'app-slot-picker',
  standalone: true,
  templateUrl: './slot-picker.component.html',
  styleUrl: './slot-picker.component.css'
})
export class SlotPickerComponent {
  private readonly turnosService = inject(TurnosService);

  /** Día en formato YYYY-MM-DD. */
  readonly date = input.required<string>();
  readonly durationMinutes = input.required<number>();
  /** Horario elegido (two-way: [(selected)]). */
  readonly selected = model<AvailableSlot | null>(null);
  /** Horario que no se puede elegir aunque figure libre (ej.: el turno actual al reprogramar). */
  readonly currentStart = input<string | null>(null);
  readonly loadError = output<void>();

  protected readonly slots = signal<AvailableSlot[]>([]);
  protected readonly loading = signal(false);
  protected readonly slow = signal(false);
  protected readonly error = signal(false);
  protected readonly formatHour = formatHour;

  private sub?: Subscription;
  private slowTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    // Cada vez que cambia el día o la duración, se vuelven a pedir los horarios.
    effect(() => {
      const date = this.date();
      const duration = this.durationMinutes();
      untracked(() => this.load(date, duration));
    });

    inject(DestroyRef).onDestroy(() => {
      this.sub?.unsubscribe();
      clearTimeout(this.slowTimer);
    });
  }

  reload(): void {
    this.load(this.date(), this.durationMinutes());
  }

  protected select(slot: AvailableSlot): void {
    if (this.isSelectable(slot)) this.selected.set(slot);
  }

  protected isSelectable(slot: AvailableSlot): boolean {
    return slot.available && slot.start !== this.currentStart();
  }

  protected statusLabel(slot: AvailableSlot): string {
    if (slot.start === this.currentStart()) return 'Tu turno actual';
    return slot.available ? 'Disponible' : 'Ocupado';
  }

  private load(date: string, duration: number): void {
    // Cancelamos la consulta anterior para que una respuesta vieja no pise a la nueva.
    this.sub?.unsubscribe();
    this.selected.set(null);
    this.error.set(false);

    if (!date) {
      this.slots.set([]);
      return;
    }

    this.setLoading(true);
    this.sub = this.turnosService.obtenerHorarios(date, duration).subscribe({
      next: (res) => {
        this.slots.set(res.slots ?? []);
        this.setLoading(false);
      },
      error: () => {
        this.slots.set([]);
        this.error.set(true);
        this.setLoading(false);
        this.loadError.emit();
      }
    });
  }

  private setLoading(loading: boolean): void {
    this.loading.set(loading);
    this.slow.set(false);
    clearTimeout(this.slowTimer);
    if (loading) {
      this.slowTimer = setTimeout(() => this.slow.set(true), SLOW_LOADING_MS);
    }
  }
}
