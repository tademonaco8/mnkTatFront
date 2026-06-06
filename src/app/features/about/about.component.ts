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
    description: 'No me interesa copiar una referencia tal cual. La idea es tomar lo que traés y transformarlo en una pieza propia.'
  },
  {
    title: 'Adaptado al cuerpo',
    description: 'El tamaño, la zona, la dirección y el peso visual importan. Un diseño tiene que funcionar en la piel, no solo en la pantalla.'
  },
  {
    title: 'Estética oscura',
    description: 'Trabajo desde el blackwork, el dark art, lo ornamental y lo gótico, con piezas de contraste y presencia.'
  }
];

timeline: TimelineItem[] = [
  {
    step: '01',
    title: 'Me contás la idea',
    description: 'Puede ser una referencia, una imagen, una palabra, una zona del cuerpo o una sensación que todavía no está del todo clara.'
  },
  {
    step: '02',
    title: 'Vemos si va con mi estilo',
    description: 'Revisamos tamaño, ubicación, nivel de detalle, estética y qué tan viable es llevar esa idea a piel.'
  },
  {
    step: '03',
    title: 'Armamos la propuesta',
    description: 'Trabajo el diseño buscando que tenga composición, presencia y una lectura clara en el cuerpo.'
  },
  {
    step: '04',
    title: 'Coordinamos la sesión',
    description: 'Definimos fecha, presupuesto, seña y cuidados previos para llegar al turno con todo claro.'
  }
];

stats = [
  { value: 'Blackwork', label: 'base visual' },
  { value: 'Dark Art', label: 'clima y estética' },
  { value: 'Custom', label: 'diseños propios' }
];
}