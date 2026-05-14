import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-testimonial-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial-slider.component.html',
  styleUrls: ['./testimonial-slider.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0%)' }))
      ]),
      transition(':leave', [
        animate('500ms ease-in', style({ opacity: 0, transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class TestimonialSliderComponent implements OnInit, OnDestroy {
  @Input() testimonials: any[] = [];
  
  currentIndex: number = 0;
  itemsPerView: number = 1;
  autoPlayInterval: any;

  ngOnInit() {
    this.startAutoPlay();
    window.addEventListener('resize', () => this.updateItemsPerView());
    this.updateItemsPerView();
  }

  ngOnDestroy() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  updateItemsPerView() {
    const width = window.innerWidth;
    if (width >= 1024) {
      this.itemsPerView = 3;
    } else if (width >= 768) {
      this.itemsPerView = 2;
    } else {
      this.itemsPerView = 1;
    }
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  nextSlide() {
    const maxIndex = Math.max(0, this.testimonials.length - this.itemsPerView);
    this.currentIndex = this.currentIndex >= maxIndex ? 0 : this.currentIndex + 1;
  }

  prevSlide() {
    const maxIndex = Math.max(0, this.testimonials.length - this.itemsPerView);
    this.currentIndex = this.currentIndex === 0 ? maxIndex : this.currentIndex - 1;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    this.stopAutoPlay();
    this.startAutoPlay();
  }

  getVisibleTestimonials() {
    return this.testimonials.slice(this.currentIndex, this.currentIndex + this.itemsPerView);
  }

  getDots() {
    const maxIndex = Math.max(0, this.testimonials.length - this.itemsPerView);
    return Array.from({ length: maxIndex + 1 }, (_, i) => i);
  }
}
