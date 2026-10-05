import { Directive, ElementRef, OnInit, Renderer2, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appRevealOnScroll]',
  standalone: true
})
export class RevealOnScrollDirective implements OnInit {
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

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