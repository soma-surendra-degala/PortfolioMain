import { Directive, ElementRef, HostBinding, OnInit } from '@angular/core';


@Directive({
  selector: '[appScrollReveal]'
})
export class ScrollRevealDirective implements OnInit {
  @HostBinding('class.show') isVisible = false;

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        this.isVisible = true;
      } else {
        this.isVisible = false; // Reset when element goes out of view
      }
    }, { threshold: 0.1 });

    observer.observe(this.el.nativeElement);
  }
}

