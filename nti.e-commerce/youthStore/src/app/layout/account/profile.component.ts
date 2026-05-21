import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../core/service/order-service';
import { AuthService } from '../../core/service/auth-service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  orderService = inject(OrderService);
  authService = inject(AuthService);
  orders: any[] = [];
  addresses: any[] = [];
  newAddress = { alias: '', details: '', phone: '' };
  showAddressForm = false;
  userData: any = { name: '', email: '' };
  isEditingProfile = false;

  ngOnInit() {
    this.loadOrders();
    this.loadAddresses();
  }

  loadAddresses() {
    this.authService.getProfile().subscribe(res => {
      this.addresses = res.data.user.addresses || [];
      this.userData = { 
        name: res.data.user.name, 
        email: res.data.user.email 
      };
    });
  }

  updateProfile() {
    this.authService.updateProfile(this.userData).subscribe(res => {
      this.isEditingProfile = false;
      alert('Profile updated successfully!');
    });
  }

  addAddress() {
    if (!this.newAddress.alias || !this.newAddress.details || !this.newAddress.phone) return;
    this.authService.addAddress(this.newAddress).subscribe(res => {
      this.addresses = res.data.addresses;
      this.showAddressForm = false;
      this.newAddress = { alias: '', details: '', phone: '' };
    });
  }

  deleteAddress(id: string) {
    this.authService.deleteAddress(id).subscribe(res => {
      this.addresses = res.data.addresses;
    });
  }

  setDefaultAddress(id: string) {
    this.authService.setDefaultAddress(id).subscribe(res => {
      this.addresses = res.data.addresses;
    });
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
