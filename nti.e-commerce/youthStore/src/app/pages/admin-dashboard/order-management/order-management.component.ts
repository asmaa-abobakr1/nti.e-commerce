import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';
import { FormsModule } from '@angular/forms';
import { Order } from '../../../models/interfaces';

@Component({
  selector: 'app-order-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3 class="fw-bold mb-4">Manage Orders</h3>
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Refund</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let order of orders">
            <td><small class="text-gray fw-bold">#{{order._id.slice(-6)}}</small></td>
            <td>{{order.user?.name}}<br><small class="text-gray">{{order.user?.phone}}</small></td>
            <td class="fw-bold text-primary">\${{order.totalPrice}}</td>
            <td>
              <select class="form-select form-select-sm rounded-pill" [ngModel]="order.status" (change)="onStatusChange(order._id, $event)">
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="refused">Refused</option>
                <option value="cancelbyadmin">Canceled (Admin)</option>
              </select>
            </td>
            <td>
              <div *ngIf="order.refundStatus === 'requested'" class="d-flex gap-1">
                <button class="btn btn-sm btn-success rounded-circle" (click)="handleRefund(order._id, true)"><i class="fas fa-check"></i></button>
                <button class="btn btn-sm btn-danger rounded-circle" (click)="handleRefund(order._id, false)"><i class="fas fa-times"></i></button>
              </div>
              <span class="small" *ngIf="order.refundStatus !== 'requested'">{{order.refundStatus}}</span>
            </td>
            <td>
              <button class="btn btn-sm btn-light text-danger rounded-circle" (click)="deleteOrder(order._id)"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class OrderManagementComponent implements OnInit {
  private orderService = inject(OrderService);
  orders: Order[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders().subscribe(res => this.orders = res.data.orders);
  }

  onStatusChange(id: string, event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    this.updateOrderStatus(id, status);
  }

  updateOrderStatus(id: string, status: string) {
    this.orderService.updateStatus(id, status).subscribe(() => this.loadOrders());
  }

  handleRefund(id: string, approved: boolean) {
    this.orderService.approveRefund(id, approved).subscribe(() => this.loadOrders());
  }

  deleteOrder(id: string) {
    if (confirm('Delete this order record?')) {
      this.orderService.deleteOrder(id).subscribe(() => this.loadOrders());
    }
  }
}
