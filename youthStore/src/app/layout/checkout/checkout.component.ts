import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CartService } from '../../core/service/cart-service';
import { OrderService } from '../../core/service/order-service';
import { UserService } from '../../core/service/user-service';

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

  total$: Observable<number> = this.cartService.cart$.pipe(
    map(cart => cart.reduce((acc, item) => acc + (item.price * item.count), 0))
  );

  ngOnInit() {
    this.userService.getMe().subscribe(res => {
      this.user = res.data.user;
      if (this.user.role === 'admin') {
        this.error = 'Admins cannot place orders.';
      }
      const defaultAddr = this.user.addresses.find((a: any) => a.isDefault);
      if (defaultAddr) this.selectedAddressId = defaultAddr._id;
    });
  }

  placeOrder() {
    if (this.user?.role === 'admin') {
      this.error = 'Admins cannot place orders.';
      return;
    }
    const address = this.user.addresses.find((a: any) => a._id === this.selectedAddressId);
    if (!address) {
      this.error = 'Please select a shipping address';
      return;
    }

    this.cartService.cart$.pipe(take(1)).subscribe(cart => {
      const orderData = {
        products: cart.map(item => ({ product: this.cartService.getItemProductId(item), count: item.count })),
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
    });
  }

  saveNewAddress() {
    this.userService.addAddress(this.newAddress).subscribe(res => {
      this.user.addresses = res.data.addresses;
      this.showAddressForm = false;
      this.newAddress = { alias: '', details: '', phone: '' };
    });
  }
}
