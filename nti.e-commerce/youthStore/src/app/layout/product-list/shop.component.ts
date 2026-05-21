import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
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
export class ShopComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private route = inject(ActivatedRoute);

  products: Product[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  filteredSubCategories: SubCategory[] = [];
  
  filters = {
    name: '',
    category: '',
    subCategory: '',
    minPrice: 0,
    maxPrice: 1000,
    sort: '-createdAt'
  };

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['category']) this.filters.category = params['category'];
      if (params['subCategory']) this.filters.subCategory = params['subCategory'];
      this.loadProducts();
    });
    this.loadCategories();
    this.loadSubCategories();
  }

  loadProducts() {
    const apiFilters: Record<string, string | number | boolean> = {};
    if (this.filters.name) {
      apiFilters['title[regex]'] = this.filters.name;
      apiFilters['title[options]'] = 'i';
    }
    if (this.filters.category) apiFilters['category'] = this.filters.category;
    if (this.filters.subCategory) apiFilters['subCategory'] = this.filters.subCategory;
    apiFilters['price[gte]'] = Number(this.filters.minPrice);
    apiFilters['price[lte]'] = Number(this.filters.maxPrice);
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
      // Backend renamed to subcategories in interface
      this.subCategories = (res.data as any).subcategories || (res.data as any).subCategories;
      this.updateFilteredSubCategories();
    });
  }

  updateFilteredSubCategories() {
    if (!this.filters.category) {
      this.filteredSubCategories = this.subCategories;
    } else {
      this.filteredSubCategories = this.subCategories.filter(s => {
        const catId = typeof s.category === 'string' ? s.category : s.category?._id;
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
      minPrice: 0,
      maxPrice: 1000,
      sort: '-createdAt'
    };
    this.applyFilters();
  }
}
