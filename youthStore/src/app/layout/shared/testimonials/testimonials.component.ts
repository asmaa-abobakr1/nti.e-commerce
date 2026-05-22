import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialSliderComponent } from '../../../components/testimonial-slider/testimonial-slider.component';
import { TestimonialService } from '../../../services/testimonial.service';
import { AuthService } from '../../../core/service/auth-service';
import { FormsModule } from '@angular/forms';
import { Testimonial, User } from '../../../models/interfaces';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, TestimonialSliderComponent, FormsModule],
  template: `
    <div class="testimonials-page py-5 bg-light min-vh-100">
      <div class="container py-5">
        <div class="text-center mb-5" data-aos="fade-up">
          <h6 class="text-primary fw-bold text-uppercase tracking-widest mb-2">Our Community</h6>
          <h1 class="display-3 fw-bolder mb-3">Customer <span class="text-gradient">Stories</span></h1>
          <p class="lead text-gray mx-auto" style="max-width: 600px;">
            Hear from our stylish community and share your own experience with YouthStore.
          </p>
        </div>

        <!-- Featured Slider -->
        <div class="mb-5 py-4">
          <app-testimonial-slider [testimonials]="testimonials"></app-testimonial-slider>
        </div>

        <div class="row g-5 mt-5">
          <!-- All Reviews Grid -->
          <div class="col-lg-8">
            <h3 class="fw-bold mb-4">All Reviews</h3>
            <div class="row g-4">
              <div class="col-md-6" *ngFor="let rev of testimonials">
                <div class="card border-0 shadow-sm rounded-5 p-4 h-100">
                  <div class="d-flex align-items-center gap-3 mb-3">
                    <div class="avatar-circle bg-primary-soft text-primary fw-bold">
                      {{ (rev.user?.name || rev.name || 'U').charAt(0) }}
                    </div>
                    <div>
                      <h6 class="fw-bold mb-0">{{ rev.user?.name || rev.name || 'Anonymous' }}</h6>
                      <div class="text-warning small">
                        <i class="fas fa-star" *ngFor="let s of [1,2,3,4,5]" [ngClass]="s <= rev.stars ? 'text-warning' : 'text-light'"></i>
                      </div>
                    </div>
                  </div>
                  <p class="text-gray mb-0 italic">"{{ rev.content }}"</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Review Form (Only for non-admins) -->
          <div class="col-lg-4" *ngIf="!authService.isAdmin()">
            <div class="card border-0 shadow-xl rounded-5 p-4 sticky-top" style="top: 100px;">
              <h4 class="fw-bold mb-4">Share Your Experience</h4>
              <div class="mb-3">
                <label class="small fw-bold mb-2">Rating</label>
                <div class="d-flex gap-2 fs-4 text-warning">
                  <i class="fa-star cursor-pointer" 
                     *ngFor="let s of [1,2,3,4,5]" 
                     [ngClass]="s <= newReview.stars ? 'fas' : 'far'"
                     (click)="newReview.stars = s"></i>
                </div>
              </div>
              <div class="mb-4">
                <label class="small fw-bold mb-2">Your Thoughts</label>
                <textarea class="form-control rounded-4" rows="4" [(ngModel)]="newReview.content" placeholder="What do you think about our collection?"></textarea>
              </div>
              <button class="btn btn-primary w-100 rounded-pill py-3 fw-bold" (click)="submitReview()">
                SUBMIT REVIEW <i class="fas fa-paper-plane ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .text-gradient {
      background: linear-gradient(135deg, var(--primary), var(--secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .avatar-circle {
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }
    .bg-primary-soft { background-color: rgba(99, 102, 241, 0.1); }
    .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
  `]
})
export class TestimonialsComponent implements OnInit {
  private testimonialService = inject(TestimonialService);
  public authService = inject(AuthService);
  testimonials: Testimonial[] = [];
  newReview = { stars: 5, content: '', name: '' };

  ngOnInit() {
    this.load();
  }

  load() {
    this.testimonialService.getApproved().subscribe((res) => {
      this.testimonials = res.data.testimonials;
    });
  }

  submitReview() {
    if (!this.newReview.content) return;
    
    
    const user = this.authService.getUser();
    if (user && 'name' in user) {
      this.newReview.name = user.name;
    } else if (!this.newReview.name) {
      this.newReview.name = 'Guest';
    }

    this.testimonialService.submit(this.newReview as Partial<Testimonial>).subscribe(() => {
      this.load();
      this.newReview = { stars: 5, content: '', name: '' };
      alert('Thank you for your feedback!');
    });
  }
}
