import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  orderService = inject(OrderService);
  authService = inject(AuthService);
  orders: any[] = [];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getMyOrders().subscribe(res => {
      this.orders = res.data.orders;
    });
  }

  cancelOrder(id: string) {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.orderService.cancelOrder(id).subscribe(() => this.loadOrders());
    }
  }

  requestRefund(id: string) {
    this.orderService.requestRefund(id).subscribe(() => this.loadOrders());
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'pending': return 'bg-warning text-dark';
      case 'shipped': return 'bg-info text-white';
      case 'delivered': return 'bg-success text-white';
      case 'cancelbyuser':
      case 'canceledbyadmin': return 'bg-danger text-white';
      default: return 'bg-secondary text-white';
    }
  }
}
