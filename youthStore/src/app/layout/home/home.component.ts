import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/service/product-service';
import { TestimonialService } from '../../services/testimonial.service';
import { SettingsService } from '../../services/settings.service';
import { AuthService } from '../../core/service/auth-service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/service/cart-service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { TestimonialSliderComponent } from '../../components/testimonial-slider/testimonial-slider.component';
import { MarketingSliderComponent } from '../../components/marketing-slider/marketing-slider.component';
import { RouterModule } from '@angular/router';
import { Product, Testimonial, Settings } from '../../models/interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent, TestimonialSliderComponent, MarketingSliderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  testimonialService = inject(TestimonialService);
  settingsService = inject(SettingsService);
  cartService = inject(CartService);
  authService = inject(AuthService);

  newArrivals: Product[] = [];
  bestSellers: Product[] = [];
  testimonials: Testimonial[] = [];
  settings: Settings | null = null;
  
  newReview = { name: '', content: '', stars: 5 };
  reviewSubmitted = false;
  reviewError = '';

  ngOnInit() {
    this.loadProducts();
    this.loadTestimonials();
    this.loadSettings();
  }

  loadSettings() {
    this.settingsService.getSettings().subscribe(res => {
      this.settings = res.data.settings;
    });
  }

  loadProducts() {
    this.productService.getProducts({ isNewArrival: true, limit: 6 }).subscribe((res) => {
      this.newArrivals = res.data.products;
    });

    this.productService.getProducts({ isBestSeller: true, limit: 4 }).subscribe((res) => {
      this.bestSellers = res.data.products;
    });
  }

  loadTestimonials() {
    this.testimonialService.getApproved().subscribe(res => {
      this.testimonials = res.data.testimonials;
    });
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  submitReview() {
    if (!this.newReview.name || !this.newReview.content) {
      this.reviewError = 'Please fill all fields.';
      return;
    }

    const reviewData: Partial<Testimonial> = { ...this.newReview };
    const user = this.authService.user$ as any;
    if (this.authService.isLoggedIn()) {
      
      
      
    }

    this.testimonialService.submit(reviewData).subscribe({
      next: () => {
        this.reviewSubmitted = true;
        this.newReview = { name: '', content: '', stars: 5 };
        this.reviewError = '';
      },
      error: () => {
        this.reviewError = 'Failed to submit review.';
      }
    });
  }
}
