import {
  Directive,
  ElementRef,
  OnInit,
  Renderer2,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective implements OnInit {
  private isBrowser: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.renderer.addClass(this.el.nativeElement, 'reveal');

    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') {
      this.renderer.addClass(this.el.nativeElement, 'reveal--visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.renderer.addClass(this.el.nativeElement, 'reveal--visible');
          observer.unobserve(this.el.nativeElement);
        }
      },
      {
        threshold: 0.14
      }
    );

    observer.observe(this.el.nativeElement);
  }
}