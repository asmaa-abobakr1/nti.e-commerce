import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule],
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
          <h2 class="fw-bolder mb-0">{{activeOrders}}</h2>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm rounded-4 p-4 bg-light">
          <p class="small mb-1 opacity-75 text-uppercase fw-bold">Total Products</p>
          <h2 class="fw-bolder mb-0">{{totalProducts}}</h2>
        </div>
      </div>
    </div>
    
    <div class="card border-0 bg-light rounded-4 p-4">
      <h5 class="fw-bold mb-3">System Status</h5>
      <p class="small mb-0 text-success"><i class="fas fa-check-circle me-2"></i>All systems operational</p>
    </div>
  `
})
export class DashboardHomeComponent implements OnInit {
  orderService = inject(OrderService);
  productService = inject(ProductService);
  
  totalSales = 0;
  activeOrders = 0;
  totalProducts = 0;

  ngOnInit() {
    this.orderService.getAllOrders().subscribe(res => {
      const orders = res.data.orders;
      this.totalSales = orders.reduce((acc: number, o: any) => acc + o.totalPrice, 0);
      this.activeOrders = orders.filter((o: any) => o.status !== 'delivered' && o.status !== 'canceledbyadmin').length;
    });
    
    this.productService.getProducts().subscribe(res => {
      this.totalProducts = res.data.products.length;
    });
  }
}
