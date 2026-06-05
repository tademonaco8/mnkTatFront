import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

type WorkCategory = 'all' | 'black-grey' | 'minimal' | 'lettering' | 'neotribal' | 'dark';

interface GalleryItem {
  id: number;
  title: string;
  category: WorkCategory[];
  subtitle: string;
  description: string;
  image: string;
  featured?: boolean;
  tags: string[];
}

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  activeFilter: WorkCategory = 'all';
  selectedWork: GalleryItem | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  filters: { label: string; value: WorkCategory }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Black & Grey', value: 'black-grey' },
    { label: 'Minimal', value: 'minimal' },
    { label: 'Lettering', value: 'lettering' }
  ];

  works: GalleryItem[] = [
    {
      id: 9,
      title: 'Ojo dark ornamental',
      category: ['dark'],
      subtitle: 'Ojo ornamental',
      description: 'Diseño de ojo central con detalles filosos, sombreado oscuro y estética dark art.',
      image: 'assets/img/work-9.jpg',
      featured: true,
      tags: ['Dark', 'Lineal', 'Diseño personalizado']
    },
    {
      id: 1,
      title: 'Fechas en números romanos y lettering',
      category: ['lettering', 'minimal'],
      subtitle: 'Tipografía fina y composición personal',
      description: 'Pieza de línea delicada que combina números romanos con lettering cursivo, pensada desde lo íntimo y lo simbólico. Un tattoo sutil, elegante y cargado de significado personal.',
      image: 'assets/img/work-1.jpg',
      featured: true,
      tags: ['Black & Grey', 'Lettering', 'Fine Line']
    },
    {
      id: 2,
      title: 'Corazón de alambre de púas',
      category: ['black-grey'],
      subtitle: 'Línea marcada, textura y contraste suave',
      description: 'Diseño de corazón formado por alambre de púas, trabajado en black & grey con sombras sutiles para dar volumen, textura y una impronta delicada pero filosa.',
      image: 'assets/img/work-7.jpg',
      featured: true,
      tags: ['Black & Grey', 'Fine Line', 'Diseño propio']
    },
    {
      id: 8,
      title: 'Rostro abstracto',
      category: ['black-grey', 'minimal'],
      subtitle: 'Rostro fragmentado',
      description: 'Pieza black & grey con rostro abstracto, sombreado suave y una composición surreal.',
      image: 'assets/img/work-8.jpg',
      featured: true,
      tags: ['Black & Grey', 'Diseño personalizado', 'Sombreado suave']
    },
    {
      id: 3,
      title: 'Neo tribal linework',
      category: ['neotribal'],
      subtitle: 'Fluidez y trazo fino',
      description: 'Diseño ornamental de líneas fluidas, inspirado en formas tribales y composición simétrica.',
      image: 'assets/img/work-2.jpg',
      featured: true,
      tags: ['Black & Grey', 'Neo Tribal', 'Linework']
    },
    {
      id: 4,
      title: 'Clavos en black & grey',
      category: ['black-grey'],
      subtitle: 'Contraste suave y diseño de alto impacto',
      description: 'Diseño gráfico de lectura directa, trabajado con sombras suaves para aportar volumen y presencia. Una pieza de estética limpia, sólida y con un lenguaje visual fuerte.',
      image: 'assets/img/work-3.jpg',
      featured: true,
      tags: ['Black & Grey', 'Diseño propio', 'Sombras']
    },
    {
      id: 5,
      title: 'Encendedor “We Burn”',
      category: ['black-grey'],
      subtitle: 'Objeto clásico con impronta personal',
      description: 'Tattoo inspirado en un encendedor clásico, reinterpretado en black & grey con una composición simple y expresiva. Una pieza con carácter, guiño visual y un concepto directo.',
      image: 'assets/img/work-4.jpg',
      featured: true,
      tags: ['Black & Grey', 'Objeto', 'Diseño personalizado']
    },
    {
      id: 6,
      title: 'Querubín minimalista',
      category: ['minimal'],
      subtitle: 'Delicadeza, ternura y detalle sutil',
      description: 'Pequeña pieza de inspiración clásica, resuelta con líneas finas y sombras suaves. Un diseño delicado, liviano y atemporal, ideal para una estética sutil con aire angelical.',
      image: 'assets/img/work-5.jpg',
      featured: true,
      tags: ['Black & Grey', 'Fine Line', 'Minimal']
    },
    {
      id: 7,
      title: 'Boomerang personalizado',
      category: ['black-grey', 'minimal'],
      subtitle: 'Objeto simbólico con identidad propia',
      description: 'Diseño pequeño y limpio, trabajado en black & grey con una sombra suave que refuerza su forma. Una pieza discreta pero personal, pensada para llevar un símbolo con historia.',
      image: 'assets/img/work-6.jpg',
      featured: true,
      tags: ['Black & Grey', 'Minimal', 'Diseño personalizado']
    }
  ];

  get filteredWorks(): GalleryItem[] {
    if (this.activeFilter === 'all') return this.works;
    return this.works.filter(work => work.category.includes(this.activeFilter));
  }

  setFilter(filter: WorkCategory): void {
    this.activeFilter = filter;
  }

  openWork(work: GalleryItem): void {
    this.selectedWork = work;

    if (this.isBrowser) {
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal(): void {
    this.selectedWork = null;

    if (this.isBrowser) {
      document.body.style.overflow = '';
    }
  }

  trackByWork(_: number, work: GalleryItem): number {
    return work.id;
  }
}