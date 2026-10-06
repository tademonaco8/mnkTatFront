import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { STUDIO, whatsappLink } from '../../shared/studio';

interface FooterLink {
  label: string;
  path?: string;
  href?: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
  readonly studio = STUDIO;

  readonly navLinks: FooterLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Trabajos', path: '/gallery' },
    { label: 'Sobre mí', path: '/about' },
    { label: 'Cuidados y FAQ', path: '/cuidados' },
    { label: 'Solicitar turno', path: '/turnos' }
  ];

  readonly contactLinks: FooterLink[] = [
    { label: 'WhatsApp', href: whatsappLink('Hola! Quiero consultar por un tatuaje.') },
    { label: 'Instagram', href: STUDIO.instagram },
    { label: STUDIO.email, href: `mailto:${STUDIO.email}` }
  ];
}
