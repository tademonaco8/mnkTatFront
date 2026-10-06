/** Toma el mensaje que manda el backend (error simple o de validación). */
export function apiErrorMessage(err: any, fallback: string): string {
  const validation = err?.error?.errors as Record<string, string[]> | undefined;
  const firstValidation = validation ? Object.values(validation).flat()[0] : undefined;
  return err?.error?.message || firstValidation || fallback;
}
