import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealOnScrollDirective } from '../../shared/directives/reveal-on-scroll.directive';
import { whatsappLink } from '../../shared/studio';
import { imageSize } from '../../shared/image-sizes';
import { availableFlash } from '../../shared/flash';

interface StyleItem {
  name: string;
  description: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface PreviewWork {
  title: string;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RevealOnScrollDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  readonly imageSize = imageSize;
  /** Hasta 3 diseños flash disponibles; si no hay, la sección no se muestra. */
  readonly flash = availableFlash().slice(0, 3);
  readonly whatsapp = whatsappLink('Hola! Quiero consultar por un tatuaje.');

  readonly styles: StyleItem[] = [
    { name: 'Black & Grey', description: 'Sombras, contraste y profundidad.' },
    { name: 'Dark Art', description: 'Piezas oscuras, ornamentales y con clima.' },
    { name: 'Lettering', description: 'Letras y números con línea propia.' }
  ];

  readonly processSteps: ProcessStep[] = [
    {
      step: '01',
      title: 'Idea',
      description: 'Me contás qué querés: una referencia, un concepto o solo una sensación.'
    },
    {
      step: '02',
      title: 'Diseño',
      description: 'Armo una propuesta pensada para la zona, el tamaño y tu cuerpo.'
    },
    {
      step: '03',
      title: 'Turno',
      description: 'Elegís un horario online. Se confirma al acordar diseño, presupuesto y seña.'
    },
    {
      step: '04',
      title: 'Sesión',
      description: 'Tatuamos sin apuro y te llevás los cuidados para que cicatrice bien.'
    }
  ];

  readonly works: PreviewWork[] = [
    { title: 'Clavos en black & grey', image: 'assets/img/work-3.webp' },
    { title: 'Rostro fragmentado', image: 'assets/img/work-8.webp' },
    { title: 'Encendedor “We Burn”', image: 'assets/img/work-4.webp' },
    { title: 'Lettering con números romanos', image: 'assets/img/work-1.webp' },
    { title: 'Neo tribal linework', image: 'assets/img/work-2.webp' },
    { title: 'Querubín minimalista', image: 'assets/img/work-5.webp' }
  ];
}
