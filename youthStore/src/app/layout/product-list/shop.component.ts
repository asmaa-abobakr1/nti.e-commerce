import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ProductService } from '../../core/service/product-service';
import { CartService } from '../../core/service/cart-service';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product, Category, SubCategory } from '../../models/interfaces';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ProductCardComponent],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {
  private routerSubscription?: Subscription;
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  readonly maxPriceLimit = 10000;

  products: Product[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  filteredSubCategories: SubCategory[] = [];
  
  filters = {
    name: '',
    category: '',
    subCategory: '',
    minPrice: 1,
    maxPrice: 10000,
    sort: '-createdAt'
  };

  ngOnInit() {
    // Reset filters and load products on initial navigation
    this.resetFilters();
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.filters.category = params['category'];
      if (params['subCategory']) this.filters.subCategory = params['subCategory'];
      this.loadProducts();
    });
    this.loadCategories();
    this.loadSubCategories();

    // Listen for future navigation events to refresh the shop page when revisited
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Assuming the shop route contains '/shop' pattern
        if (event.urlAfterRedirects.includes('/shop')) {
          this.resetFilters();
          this.loadProducts();
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadProducts() {
    const apiFilters: Record<string, string | number | boolean> = {};
    if (this.filters.name) {
      apiFilters['title[regex]'] = this.filters.name;
      apiFilters['title[options]'] = 'i';
    }
    if (this.filters.category) apiFilters['category'] = this.filters.category;
    if (this.filters.subCategory) apiFilters['subCategory'] = this.filters.subCategory;
    if (this.filters.minPrice > 1) apiFilters['price[gte]'] = Number(this.filters.minPrice);
    if (this.filters.maxPrice < this.maxPriceLimit) apiFilters['price[lte]'] = Number(this.filters.maxPrice);
    apiFilters['sort'] = this.filters.sort;

    this.productService.getProducts(apiFilters).subscribe(res => {
      this.products = res.data.products;
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe(res => {
      this.categories = res.data.categories;
    });
  }

  loadSubCategories() {
    this.productService.getSubCategories().subscribe(res => {
      this.subCategories = (res.data as any).subcategories || (res.data as any).subCategories;
      this.updateFilteredSubCategories();
    });
  }

  updateFilteredSubCategories() {
    if (!this.filters.category) {
      this.filteredSubCategories = this.subCategories;
    } else {
      this.filteredSubCategories = this.subCategories.filter(s => {
        if (Array.isArray(s.category)) {
          return s.category.some(cat => {
            const catId = typeof cat === 'string' ? cat : cat?._id;
            return catId === this.filters.category;
          });
        }
        const catId = typeof s.category === 'string' ? s.category : (s.category as any)?._id;
        return catId === this.filters.category;
      });
    }
  }

  applyFilters() {
    this.updateFilteredSubCategories();
    this.loadProducts();
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  resetFilters() {
    this.filters = {
      name: '',
      category: '',
      subCategory: '',
      minPrice: 1,
      maxPrice: this.maxPriceLimit,
      sort: '-createdAt'
    };
    this.applyFilters();
  }
}
