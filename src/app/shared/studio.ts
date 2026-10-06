/** Datos de contacto del estudio, en un solo lugar. */
export const STUDIO = {
  name: 'MNK Ink',
  whatsapp: '542494209376',
  instagram: 'https://instagram.com/mnk.tat',
  email: 'tademonaco8@gmail.com'
} as const;

export function whatsappLink(text?: string): string {
  const base = `https://wa.me/${STUDIO.whatsapp}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
