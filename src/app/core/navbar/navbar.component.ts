import { Component, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { hasFlash } from '../../shared/flash';
import { STUDIO, whatsappLink } from '../../shared/studio';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  private readonly router = inject(Router);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly whatsapp = whatsappLink('Hola! Quiero consultar por un tatuaje.');
  readonly instagram = STUDIO.instagram;

  isMenuOpen = false;
  isScrolled = false;

  navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Trabajos', path: '/gallery' },
    ...(hasFlash() ? [{ label: 'Flash', path: '/flash' }] : []),
    { label: 'Sobre mí', path: '/about' },
    { label: 'Cuidados', path: '/cuidados' },
    { label: 'Turnos', path: '/turnos' }
  ];

  constructor() {
    // El scroll al inicio de cada página lo maneja el router (withInMemoryScrolling en app.config.ts).
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(() => this.closeMenu());
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.syncBodyScroll();
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.syncBodyScroll();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isMenuOpen) this.closeMenu();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.isBrowser) return;
    this.isScrolled = window.scrollY > 14;
  }

  private syncBodyScroll(): void {
    if (!this.isBrowser) return;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    // Permite ocultar el botón flotante de WhatsApp mientras el menú está abierto.
    document.body.classList.toggle('menu-open', this.isMenuOpen);
  }
}