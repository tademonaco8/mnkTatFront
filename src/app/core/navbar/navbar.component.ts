import { Component, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

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

  isMenuOpen = false;
  isScrolled = false;

  navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Trabajos', path: '/gallery' },
    { label: 'Sobre mí', path: '/about' },
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
  }
}