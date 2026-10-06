/** Tamaño real de cada foto (ancho × alto), para reservar el espacio y que el mosaico no salte al cargar. */
export const IMAGE_SIZES: Record<string, { width: number; height: number }> = {
  'assets/img/work-1.webp': { width: 900, height: 1600 },
  'assets/img/work-2.webp': { width: 1200, height: 941 },
  'assets/img/work-3.webp': { width: 900, height: 1600 },
  'assets/img/work-4.webp': { width: 1200, height: 1500 },
  'assets/img/work-5.webp': { width: 900, height: 1600 },
  'assets/img/work-6.webp': { width: 900, height: 1600 },
  'assets/img/work-7.webp': { width: 1200, height: 1200 },
  'assets/img/work-8.webp': { width: 512, height: 911 },
  'assets/img/work-9.webp': { width: 512, height: 911 }
};

export function imageSize(src: string): { width: number; height: number } {
  return IMAGE_SIZES[src] ?? { width: 900, height: 1200 };
}
