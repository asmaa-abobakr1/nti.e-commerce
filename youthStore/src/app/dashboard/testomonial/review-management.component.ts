import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestimonialService } from '../../services/testimonial.service';

import { FormsModule } from '@angular/forms';
import { Testimonial } from '../../models/interfaces';

@Component({
  selector: 'app-review-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
      <h3 class="fw-bold m-0">Reviews Management</h3>
      <div class="d-flex gap-2 align-items-center">
        <select class="form-select form-select-sm rounded-pill px-3" [(ngModel)]="filters.isApproved" (change)="applyFilters()">
          <option [value]="0">All Status</option>
          <option [value]="2">Pending</option>
          <option [value]="1">Approved</option>
          <option [value]="3">Rejected</option>
        </select>
        <select class="form-select form-select-sm rounded-pill px-3" [(ngModel)]="filters.stars" (change)="applyFilters()">
          <option [value]="0">All Ratings</option>
          <option [value]="5">5 Stars</option>
          <option [value]="4">4 Stars</option>
          <option [value]="3">3 Stars</option>
          <option [value]="2">2 Stars</option>
          <option [value]="1">1 Star</option>
        </select>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th class="py-3 px-4">Name</th>
              <th>Content</th>
              <th>Rating</th>
              <th>Status</th>
              <th class="text-end px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let review of filteredReviews">
              <td class="px-4 fw-bold">{{review.name}}</td>
              <td style="max-width: 300px;" class="text-truncate">{{review.content}}</td>
              <td>{{review.stars}} <i class="fas fa-star text-warning small"></i></td>
              <td>
                <span class="badge rounded-pill" 
                      [ngClass]="{
                        'bg-success': review.isApproved === 1,
                        'bg-warning': review.isApproved === 2,
                        'bg-danger': review.isApproved === 3
                      }">
                  {{ review.isApproved === 1 ? 'Approved' : (review.isApproved === 2 ? 'Pending' : 'Rejected') }}
                </span>
              </td>
              <td class="text-end px-4">
                <button class="btn btn-sm btn-success me-2 rounded-circle" *ngIf="review.isApproved !== 1" (click)="updateStatus(review._id, 1)" title="Approve">
                  <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger rounded-circle" *ngIf="review.isApproved !== 3" (click)="updateStatus(review._id, 3)" title="Reject">
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="reviews.length === 0">
              <td colspan="5" class="text-center py-5 text-muted">No reviews found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: []
})
export class ReviewManagementComponent implements OnInit {
  private testimonialService = inject(TestimonialService);
  reviews: Testimonial[] = [];
  filteredReviews: Testimonial[] = [];

  filters = {
    isApproved: 0,
    stars: 0
  };

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.testimonialService.getAll().subscribe({
      next: (res) => {
        this.reviews = res.data.testimonials;
        this.applyFilters();
      }
    });
  }

  applyFilters() {
    this.filteredReviews = this.reviews.filter(review => {
      const matchStatus = this.filters.isApproved == 0 || review.isApproved == this.filters.isApproved;
      const matchStars = this.filters.stars == 0 || review.stars == this.filters.stars;
      return matchStatus && matchStars;
    });
  }

  updateStatus(id: string, isApproved: 1 | 2 | 3) {
    
    (this.testimonialService as any).updateStatus(id, { isApproved }).subscribe({
      next: () => {
        this.loadReviews();
      }
    });
  }
}
