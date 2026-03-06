import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface ValueItem {
  title: string;
  description: string;
}

interface TimelineItem {
  step: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  values: ValueItem[] = [
    {
      title: 'Diseño con intención',
      description: 'Cada pieza busca sostener una idea, un clima y una lectura visual clara en el cuerpo.'
    },
    {
      title: 'Proceso cuidado',
      description: 'Desde la charla inicial hasta la reserva del turno, todo está pensado para que la experiencia sea prolija.'
    },
    {
      title: 'Estética con identidad',
      description: 'Black & grey, dark art y composiciones custom donde el peso visual y la atmósfera importan.'
    }
  ];

  timeline: TimelineItem[] = [
    {
      step: '01',
      title: 'Escucha',
      description: 'Primero aparece la idea: una imagen, una emoción, una referencia o algo que todavía no tiene forma.'
    },
    {
      step: '02',
      title: 'Construcción',
      description: 'Se trabaja composición, tamaño, contraste, ubicación y cómo esa pieza va a convivir con el cuerpo.'
    },
    {
      step: '03',
      title: 'Reserva',
      description: 'El turno se agenda desde la web, con disponibilidad real y una experiencia más ordenada.'
    },
    {
      step: '04',
      title: 'Sesión',
      description: 'La ejecución busca presencia, lectura y una pieza que mantenga fuerza en el tiempo.'
    }
  ];

  stats = [
    { value: 'Black/Grey', label: 'lenguaje visual' },
    { value: 'Dark Art', label: 'enfoque creativo' },
    { value: 'Online', label: 'reserva integrada' }
  ];
}