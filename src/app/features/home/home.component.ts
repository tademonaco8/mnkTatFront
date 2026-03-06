import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';

interface HighlightItem {
  title: string;
  description: string;
  badge: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface PreviewWork {
  title: string;
  subtitle: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealOnScrollDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  highlights: HighlightItem[] = [
    {
      title: 'Reserva online',
      description: 'Disponibilidad real, validación de conflictos y creación automática en Google Calendar.',
      badge: 'Booking'
    },
    {
      title: 'Diseño personalizado',
      description: 'Cada proyecto se piensa según la idea, la zona del cuerpo y la energía que querés llevar.',
      badge: 'Custom'
    },
    {
      title: 'Estética oscura',
      description: 'Black & grey, dark art, contraste, atmósfera y piezas con identidad.',
      badge: 'Style'
    }
  ];

  processSteps: ProcessStep[] = [
    {
      step: '01',
      title: 'Idea',
      description: 'Traés referencia, concepto o emoción. Definimos por dónde empezar.'
    },
    {
      step: '02',
      title: 'Diseño',
      description: 'Se trabaja composición, lectura visual, tamaño y adaptación al cuerpo.'
    },
    {
      step: '03',
      title: 'Reserva',
      description: 'Elegís fecha, horario y dejás tu turno confirmado desde la web.'
    },
    {
      step: '04',
      title: 'Sesión',
      description: 'Se ejecuta la pieza buscando presencia, contraste y personalidad.'
    }
  ];

  works: PreviewWork[] = [
    {
      title: 'Black & Grey',
      subtitle: 'Sombras, contraste y profundidad',
      image: 'assets/img/work-7.jpg'
    },
    {
      title: 'Lettering',
      subtitle: 'Línea suave y orgánica.',
      image: 'assets/img/work-2.jpg'
    },
    {
      title: 'Minimal',
      subtitle: 'Diseño pensado para shockear con su simplicidad.',
      image: 'assets/img/work-6.jpg'
    }
  ];

  bookingPreview = [
    'Miércoles · 14:00',
    'Jueves · 16:00',
    'Sábado · 12:00'
  ];
}