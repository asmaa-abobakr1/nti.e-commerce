import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  productService = inject(ProductService);
  cartService = inject(CartService);

  products: any[] = [];
  categories: any[] = [];
  
  filters = {
    name: '',
    category: '',
    gender: '',
    minPrice: 0,
    maxPrice: 1000
  };

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    const apiFilters: any = {};
    if (this.filters.name) apiFilters.title = { $regex: this.filters.name, $options: 'i' };
    if (this.filters.category) apiFilters.category = this.filters.category;
    if (this.filters.gender) apiFilters.gender = this.filters.gender;
    apiFilters.price = { gte: this.filters.minPrice, lte: this.filters.maxPrice };

    this.productService.getProducts(apiFilters).subscribe(res => {
      this.products = res.data.products;
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe(res => {
      this.categories = res.data.categories;
    });
  }

  applyFilters() {
    this.loadProducts();
  }

  addToCart(product: any) {
    this.cartService.addToCart(product);
  }
}
