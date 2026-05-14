import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { TestimonialService } from '../../services/testimonial.service';
import { SettingsService } from '../../services/settings.service';
import { CartService } from '../../services/cart.service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { TestimonialSliderComponent } from '../../components/testimonial-slider/testimonial-slider.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, TestimonialSliderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  productService = inject(ProductService);
  testimonialService = inject(TestimonialService);
  settingsService = inject(SettingsService);
  cartService = inject(CartService);

  newArrivals: any[] = [];
  bestSellers: any[] = [];
  testimonials: any[] = [];
  settings: any = null;

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
    this.productService.getProducts({ limit: 6, sort: '-createdAt' }).subscribe(res => {
      this.newArrivals = res.data.products;
    });

    this.productService.getProducts({ limit: 4, sort: '-soldCount' }).subscribe(res => {
      this.bestSellers = res.data.products;
    });
  }

  loadTestimonials() {
    this.testimonialService.getApproved().subscribe(res => {
      this.testimonials = res.data.testimonials;
    });
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
