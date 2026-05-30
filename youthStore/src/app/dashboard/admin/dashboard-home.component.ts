import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/service/order-service';
import { ProductService } from '../../core/service/product-service';
import { RouterModule } from '@angular/router';
import { Product, Order } from '../../models/interfaces';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h3 class="fw-bold mb-4">Dashboard Overview</h3>
    <div class="row g-4 mb-5">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-primary text-white">
          <p class="small mb-1 opacity-75 text-uppercase fw-bold">Total Sales</p>
          <h2 class="fw-bolder mb-0">\${{totalSales}}</h2>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-dark text-white">
          <p class="small mb-1 opacity-75 text-uppercase fw-bold">Active Orders</p>
          <h2 class="fw-bolder mb-0" style="color: white;">{{activeOrders}}</h2>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-light">
          <p class="small mb-1 opacity-75 text-uppercase fw-bold">Total Products</p>
          <h2 class="fw-bolder mb-0">{{totalProducts}}</h2>
        </div>
      </div>
    </div>
    
    <div class="card border-0 bg-light rounded-4 p-4 mb-4">
      <h5 class="fw-bold mb-3">System Status</h5>
      <p class="small mb-0 text-success"><i class="fas fa-check-circle me-2"></i>All systems operational</p>
    </div>

    <div class="row g-4">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm rounded-5 p-4 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0">Best Sellers</h5>
            <span class="badge bg-primary-soft text-primary">{{bestSellersCount}} Products</span>
          </div>
          <div class="list-group list-group-flush">
            <div class="list-group-item px-0 border-0 d-flex align-items-center gap-3" *ngFor="let p of bestSellersList">
              <img [src]="p.img" width="40" height="40" class="rounded-3" style="object-fit: cover;">
              <span class="small fw-bold">{{p.title}}</span>
            </div>
          </div>
          <a routerLink="/admin/products" class="btn btn-link text-primary p-0 mt-3 text-decoration-none small fw-bold">Manage Featured <i class="fas fa-arrow-right ms-1"></i></a>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card border-0 shadow-sm rounded-5 p-4 bg-white h-100">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h5 class="fw-bold mb-0">New Arrivals</h5>
            <span class="badge bg-primary-soft text-primary">{{newArrivalsCount}} Products</span>
          </div>
          <div class="list-group list-group-flush">
            <div class="list-group-item px-0 border-0 d-flex align-items-center gap-3" *ngFor="let p of newArrivalsList">
              <img [src]="p.img" width="40" height="40" class="rounded-3" style="object-fit: cover;">
              <span class="small fw-bold">{{p.title}}</span>
            </div>
          </div>
          <a routerLink="/admin/products" class="btn btn-link text-primary p-0 mt-3 text-decoration-none small fw-bold">Manage New <i class="fas fa-arrow-right ms-1"></i></a>
        </div>
      </div>
    </div>
  `
})
export class DashboardHomeComponent implements OnInit {
  private orderService = inject(OrderService);
  private productService = inject(ProductService);
  
  bestSellersCount = 0;
  newArrivalsCount = 0;
  bestSellersList: Product[] = [];
  newArrivalsList: Product[] = [];
  totalSales = 0;
  activeOrders = 0;
  totalProducts = 0;

  ngOnInit() {
    this.orderService.getAllOrders().subscribe(res => {
      const orders = res.data.orders;
      this.totalSales = orders.reduce((acc: number, o: Order) => acc + o.totalPrice, 0);
      this.activeOrders = orders.filter((o: Order) => o.status !== 'delivered' && o.status !== 'cancelbyadmin').length;
    });
    
    this.productService.getProducts().subscribe(res => {
      const products = res.data.products;
      this.totalProducts = products.length;
      this.bestSellersList = products.filter((p: Product) => p.isBestSeller).slice(0, 3);
      this.newArrivalsList = products.filter((p: Product) => p.isNewArrival).slice(0, 3);
      this.bestSellersCount = products.filter((p: Product) => p.isBestSeller).length;
      this.newArrivalsCount = products.filter((p: Product) => p.isNewArrival).length;
    });
  }
}
