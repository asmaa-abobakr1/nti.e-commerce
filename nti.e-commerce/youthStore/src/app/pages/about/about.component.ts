import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <div class="row align-items-center g-5">
        <div class="col-lg-6">
          <div class="position-relative">
            <div class="bg-primary rounded-5 position-absolute w-100 h-100" style="transform: rotate(3deg); z-index: -1; opacity: 0.1;"></div>
            <img src="assets/ceo_funny_profile.png" class="img-fluid rounded-5 shadow-lg" alt="CEO Profile">
          </div>
        </div>
        <div class="col-lg-6">
          <h6 class="text-primary fw-bold text-uppercase mb-2">Our Story</h6>
          <h2 class="display-4 fw-bolder mb-4">The Brain Behind the <span class="text-primary">YouthStore</span></h2>
          <p class="lead text-gray mb-4">
            Hi, I'm the CEO (Chief Excitement Officer). I started YouthStore because I was tired of clothes that looked like they belonged in a museum. 
          </p>
          <p class="text-gray mb-5">
            We believe that fashion should be as dynamic and unpredictable as your TikTok feed. Our mission is to provide you with styles that make your parents say "Wait, you're wearing that?" and your friends say "Where did you get that?!"
          </p>
          <div class="row g-4">
            <div class="col-6">
              <div class="d-flex align-items-center gap-3">
                <div class="bg-primary-light p-3 rounded-circle text-primary">
                  <i class="fas fa-rocket fs-4"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-0">Fast Style</h6>
                  <small class="text-gray">Updated Daily</small>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div class="d-flex align-items-center gap-3">
                <div class="bg-success-light p-3 rounded-circle text-success">
                  <i class="fas fa-smile fs-4"></i>
                </div>
                <div>
                  <h6 class="fw-bold mb-0">Happy Vibz</h6>
                  <small class="text-gray">100% Guaranteed</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bg-primary-light { background: rgba(var(--bs-primary-rgb), 0.1); }
    .bg-success-light { background: rgba(var(--bs-success-rgb), 0.1); }
  `]
})
export class AboutComponent {}
