/**
 * DISEÑOS FLASH
 * =============
 * Mientras esta lista esté vacía, la sección Flash NO aparece en ningún lado
 * (ni en el menú, ni en el inicio, y /flash redirige al inicio).
 *
 * Para agregar un diseño:
 *  1. Guardá la imagen en src/assets/img/flash/ (ideal: WebP o JPG de ~1000 px de ancho).
 *  2. Agregá un objeto a la lista de abajo. Ejemplo:
 *
 *     {
 *       id: 'ojo-polilla',                       // único, sin espacios (va en el link)
 *       title: 'Ojo con alas de polilla',
 *       image: 'assets/img/flash/ojo-polilla.webp',
 *       width: 1000,                             // tamaño real de la imagen, en px
 *       height: 1250,
 *       size: '8–10 cm',
 *       durationMinutes: 60,                     // 60, 120 o 180 (preselecciona la duración del turno)
 *       price: '$45.000',                        // opcional: si no lo ponés, dice "Consultar"
 *       series: 'Ojos',                          // opcional: agrupa diseños de la misma plancha
 *       status: 'disponible'                     // 'disponible' o 'tomado'
 *     }
 *
 *  3. Cuando lo tatuás, cambiá status a 'tomado': queda visible como "Tomado"
 *     (sirve para mostrar que el flash se mueve) pero ya no se puede pedir.
 */

export type FlashStatus = 'disponible' | 'tomado';

export interface FlashDesign {
  id: string;
  title: string;
  image: string;
  width: number;
  height: number;
  size: string;
  durationMinutes: 60 | 120 | 180;
  price?: string;
  series?: string;
  status: FlashStatus;
}

export const FLASH_DESIGNS: FlashDesign[] = [];

export function hasFlash(): boolean {
  return FLASH_DESIGNS.length > 0;
}

export function availableFlash(): FlashDesign[] {
  return FLASH_DESIGNS.filter((d) => d.status === 'disponible');
}

export function findFlash(id: string | null | undefined): FlashDesign | undefined {
  return id ? FLASH_DESIGNS.find((d) => d.id === id) : undefined;
}
