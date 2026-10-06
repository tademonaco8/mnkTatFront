import { Component } from '@angular/core';
import { whatsappLink } from '../../shared/studio';

/** Botón flotante para escribir por WhatsApp, visible en todas las páginas. */
@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  template: `
    <a
      class="wa-button"
      [href]="link"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribime por WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z" />
        <path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01" />
      </svg>
      <span class="wa-button__label">WhatsApp</span>
    </a>
  `,
  styles: `
    .wa-button {
      position: fixed;
      right: 20px;
      bottom: 20px;
      z-index: 900;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 18px;
      border-radius: 999px;
      background: #1f9d55;
      color: #fff;
      font-weight: 700;
      font-size: 0.95rem;
      text-decoration: none;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .wa-button:hover {
      transform: translateY(-2px);
      background: #23b261;
    }

    .wa-button:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 3px;
    }

    @media (max-width: 600px) {
      .wa-button {
        right: 14px;
        bottom: 14px;
        padding: 14px;
      }

      .wa-button__label {
        display: none;
      }
    }
  `
})
export class WhatsappButtonComponent {
  readonly link = whatsappLink('Hola! Quiero consultar por un tatuaje.');
}
