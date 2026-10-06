import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FLASH_DESIGNS, FlashDesign } from '../../shared/flash';
import { formatDuration } from '../../shared/utils/dates';
import { whatsappLink } from '../../shared/studio';

interface FlashGroup {
  series: string | null;
  designs: FlashDesign[];
}

/** Diseños flash: listos para tatuar, cada uno se tatúa una sola vez. */
@Component({
  selector: 'app-flash',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './flash.component.html',
  styleUrl: './flash.component.css'
})
export class FlashComponent {
  readonly formatDuration = formatDuration;
  readonly whatsapp = whatsappLink('Hola! Quiero consultar por un diseño flash.');

  /** Agrupados por plancha (series), con los disponibles primero. */
  readonly groups: FlashGroup[] = this.buildGroups(FLASH_DESIGNS);

  private buildGroups(designs: FlashDesign[]): FlashGroup[] {
    const sorted = [...designs].sort(
      (a, b) => Number(a.status === 'tomado') - Number(b.status === 'tomado')
    );
    const map = new Map<string | null, FlashDesign[]>();
    for (const d of sorted) {
      const key = d.series ?? null;
      map.set(key, [...(map.get(key) ?? []), d]);
    }
    return [...map.entries()].map(([series, items]) => ({ series, designs: items }));
  }
}
