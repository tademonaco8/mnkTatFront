import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface FooterLink {
  label: string;
  path?: string;
  href?: string;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  year = new Date().getFullYear();

  navLinks: FooterLink[] = [
    { label: 'Inicio', path: '/' },
    { label: 'Trabajos', path: '/gallery' },
    { label: 'Sobre mí', path: '/about' },
    { label: 'Turnos', path: '/turnos' }
  ];

  socialLinks: FooterLink[] = [
    { label: 'Instagram', href: 'https://instagram.com/mnk.tat' },
    { label: 'WhatsApp', href: 'https://wa.me/542494209376' },
    { label: 'Mail', href: 'mailto:tademonaco8@gmail.com' }
  ];

  contactCards = [
    {
      title: 'Ubicación',
      value: 'Tandil, Buenos Aires',
      caption: 'Atención con reserva previa'
    },
    {
      title: 'Agenda',
      value: 'Turnos online',
      caption: 'Disponibilidad integrada'
    },
    {
      title: 'Estilo',
      value: 'Black & Grey / Dark Art',
      caption: 'Diseño custom'
    }
  ];
}