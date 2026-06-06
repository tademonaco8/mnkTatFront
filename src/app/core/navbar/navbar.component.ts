import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isMenuOpen = false;
  isScrolled = false;
  private isBrowser: boolean;

  navItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Trabajos', path: '/gallery' },
    { label: 'Sobre mí', path: '/about' },
    { label: 'Turnos', path: '/turnos' }
  ];

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeMenu();

        if (this.isBrowser) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    this.syncBodyScroll();
  }

  closeMenu(): void {
    this.isMenuOpen = false;
    this.syncBodyScroll();
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