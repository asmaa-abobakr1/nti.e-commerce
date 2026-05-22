import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/service/order-service';
import { FormsModule } from '@angular/forms';
import { Order } from '../../models/interfaces';

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
                <option value="cancelbyuser">Canceled (User)</option>
                <option value="canceledbyadmin">Canceled (Admin)</option>
              </select>
            </td>
            <td>
              <div *ngIf="order.refundStatus === 'requested'" class="d-flex gap-1">
                <button class="btn btn-sm btn-success rounded-circle" (click)="handleRefund(order._id, true)"><i class="fas fa-check"></i></button>
                <button class="btn btn-sm btn-danger rounded-circle" (click)="handleRefund(order._id, false)"><i class="fas fa-times"></i></button>
              </div>
              <span class="small text-capitalize" *ngIf="order.refundStatus !== 'requested'">{{order.refundStatus}}</span>
            </td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-sm btn-light text-primary rounded-circle" (click)="viewOrderDetails(order)" title="View Details">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-light text-danger rounded-circle" (click)="deleteOrder(order._id)" title="Delete Order">
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal fade show d-block" *ngIf="selectedOrder" style="background: rgba(0,0,0,0.5)">
       <div class="modal-dialog modal-lg modal-dialog-centered">
         <div class="modal-content rounded-5 border-0 p-4" style="max-height: 90vh; overflow-y: auto;">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h4 class="fw-bold mb-0">Order Details #{{selectedOrder._id.slice(-6)}}</h4>
              <button class="btn-close" (click)="closeDetails()"></button>
            </div>
            
            <div class="row g-4">
              <div class="col-md-6">
                <div class="card border-0 bg-light rounded-4 p-3 h-100">
                  <h6 class="fw-bold text-dark mb-3"><i class="fas fa-user-circle me-2"></i>Customer Information</h6>
                  <p class="mb-1 small"><strong>Name:</strong> {{selectedOrder.user?.name || 'N/A'}}</p>
                  <p class="mb-1 small"><strong>Email:</strong> {{selectedOrder.user?.email || 'N/A'}}</p>
                  <p class="mb-1 small"><strong>Phone:</strong> {{selectedOrder.user?.phone || 'N/A'}}</p>
                </div>
              </div>
              
              <div class="col-md-6">
                <div class="card border-0 bg-light rounded-4 p-3 h-100">
                  <h6 class="fw-bold text-dark mb-3"><i class="fas fa-map-marker-alt me-2"></i>Shipping Address</h6>
                  <p class="mb-0 small text-secondary" style="white-space: pre-line;">{{selectedOrder.address}}</p>
                </div>
              </div>

              <div class="col-12">
                <h6 class="fw-bold text-dark mb-3"><i class="fas fa-shopping-bag me-2"></i>Products List</h6>
                <div class="table-responsive">
                  <table class="table align-middle">
                    <thead>
                      <tr class="text-secondary small">
                        <th>Product</th>
                        <th>Price</th>
                        <th class="text-center">Qty</th>
                        <th class="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let item of selectedOrder.products">
                        <td>
                          <div class="d-flex align-items-center gap-3">
                            <img *ngIf="item.product?.img" [src]="item.product.img" width="40" height="40" class="rounded-3" style="object-fit: cover;">
                            <span class="fw-bold small">{{item.product?.title || 'Unknown Product'}}</span>
                          </div>
                        </td>
                        <td>\${{item.price}}</td>
                        <td class="text-center">{{item.count}}</td>
                        <td class="text-end fw-bold text-primary">\${{item.price * item.count}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div class="col-12">
                <div class="d-flex justify-content-between align-items-center bg-primary bg-opacity-10 rounded-4 p-3">
                  <div>
                    <span class="small text-secondary">Status:</span>
                    <span class="badge bg-primary ms-2 text-capitalize">{{selectedOrder.status}}</span>
                  </div>
                  <div class="text-end">
                    <span class="small text-secondary me-2">Grand Total:</span>
                    <span class="h4 fw-bold text-primary mb-0">\${{selectedOrder.totalPrice}}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="d-flex justify-content-end mt-4">
              <button class="btn btn-light rounded-pill px-5 py-2" (click)="closeDetails()">CLOSE</button>
            </div>
         </div>
       </div>
    </div>
  `
})
export class OrderManagementComponent implements OnInit {
  private orderService = inject(OrderService);
  orders: Order[] = [];
  selectedOrder: Order | null = null;

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
    this.orderService.updateStatus(id, status).subscribe(() => {
      this.loadOrders();
      if (this.selectedOrder && this.selectedOrder._id === id) {
        this.selectedOrder.status = status as any;
      }
    });
  }

  handleRefund(id: string, approved: boolean) {
    this.orderService.approveRefund(id, approved).subscribe(() => this.loadOrders());
  }

  deleteOrder(id: string) {
    if (confirm('Delete this order record?')) {
      this.orderService.deleteOrder(id).subscribe(() => this.loadOrders());
    }
  }

  viewOrderDetails(order: Order) {
    this.selectedOrder = order;
  }

  closeDetails() {
    this.selectedOrder = null;
  }
}
