import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number | boolean>) => void };
  }
}

/** Dominio donde se cuentan las visitas (así las pruebas en local no ensucian los números). */
const TRACKED_DOMAIN = 'mnktattoo.netlify.app';

/**
 * Estadísticas con Umami Cloud: visitas por página (automático, sin cookies) y
 * eventos clave como "solicitud-enviada". Si no hay Website ID configurado, no hace nada.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private loaded = false;

  /** Carga el script de Umami una sola vez (se llama al iniciar la app). */
  init(): void {
    const websiteId = environment.umamiWebsiteId;
    if (!this.isBrowser || this.loaded || !websiteId) return;

    const script = this.document.createElement('script');
    script.defer = true;
    script.src = 'https://cloud.umami.is/script.js';
    script.dataset['websiteId'] = websiteId;
    script.dataset['domains'] = TRACKED_DOMAIN;
    script.dataset['doNotTrack'] = 'true';
    this.document.head.appendChild(script);
    this.loaded = true;

    // Clics a WhatsApp e Instagram desde cualquier parte del sitio, en un solo lugar.
    this.document.addEventListener('click', (e) => {
      const link = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;
      const pagina = this.document.defaultView?.location.pathname ?? '';
      if (link.href.startsWith('https://wa.me/')) this.track('whatsapp', { pagina });
      else if (link.href.includes('instagram.com')) this.track('instagram', { pagina });
    });
  }

  /** Registra un evento (ej. 'solicitud-enviada'). Nunca rompe la app si Umami no cargó. */
  track(event: string, data?: Record<string, string | number | boolean>): void {
    if (!this.isBrowser) return;
    try {
      this.document.defaultView?.umami?.track(event, data);
    } catch {
      // Un bloqueador de anuncios puede impedir Umami: lo ignoramos.
    }
  }
}
