import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-marketing-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="marketing-slider-wrapper overflow-hidden py-5 bg-light" (mouseenter)="stop()" (mouseleave)="start()">
      <div class="marketing-track d-flex gap-4 px-4" [style.transform]="'translateX(' + (-currentIndex * (100 / itemsPerView)) + '%)'">
        <div class="marketing-item" *ngFor="let img of images">
          <div class="marketing-card-container p-2">
            <img [src]="img" class="rounded-5 shadow-sm w-100" style="height: 300px; object-fit: cover;">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .marketing-slider-wrapper { width: 100%; position: relative; }
    .marketing-track { transition: transform 0.8s linear; }
    .marketing-item { flex: 0 0 calc(100% / 3); min-width: 300px; }
    @media (max-width: 768px) { .marketing-item { flex: 0 0 100%; } }
  `]
})
export class MarketingSliderComponent implements OnInit, OnDestroy {
  @Input() images: string[] = [];
  currentIndex = 0;
  itemsPerView = 3;
  private intervalId: number | null = null;

  ngOnInit() {
    this.updateItemsPerView();
    this.start();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  ngOnDestroy() {
    this.stop();
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    this.updateItemsPerView();
  }

  updateItemsPerView() {
    this.itemsPerView = window.innerWidth < 768 ? 1 : 3;
    
    const max = Math.max(0, this.images.length - this.itemsPerView);
    if (this.currentIndex > max) this.currentIndex = max;
  }

  start() {
    if (this.images.length <= this.itemsPerView) return;
    this.stop();
    this.intervalId = window.setInterval(() => {
      const max = this.images.length - this.itemsPerView;
      this.currentIndex = this.currentIndex >= max ? 0 : this.currentIndex + 1;
    }, 2000);
  }

  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
