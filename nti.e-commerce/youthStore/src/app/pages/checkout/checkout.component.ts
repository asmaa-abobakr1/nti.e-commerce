import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  userService = inject(UserService);
  router = inject(Router);

  user: any = null;
  selectedAddressId: string = '';
  newAddress = { alias: '', details: '', phone: '' };
  showAddressForm = false;
  error: string = '';

  ngOnInit() {
    this.userService.getMe().subscribe(res => {
      this.user = res.data.user;
      const defaultAddr = this.user.addresses.find((a: any) => a.isDefault);
      if (defaultAddr) this.selectedAddressId = defaultAddr._id;
    });
  }

  placeOrder() {
    const address = this.user.addresses.find((a: any) => a._id === this.selectedAddressId);
    if (!address) {
      this.error = 'Please select a shipping address';
      return;
    }

    this.cartService.cart$.subscribe(cart => {
      const orderData = {
        products: cart.map(item => ({ product: item.product._id, count: item.count })),
        address: `${address.alias}: ${address.details} (Tel: ${address.phone})`,
        paymentMethod: 'cash'
      };

      this.orderService.createOrder(orderData).subscribe({
        next: () => {
          this.cartService.clearCart();
          this.router.navigate(['/profile']);
        },
        error: (err) => this.error = err.error.message || 'Order failed'
      });
    }).unsubscribe();
  }

  saveNewAddress() {
    this.userService.addAddress(this.newAddress).subscribe(res => {
      this.user.addresses = res.data.addresses;
      this.showAddressForm = false;
      this.newAddress = { alias: '', details: '', phone: '' };
    });
  }
}
