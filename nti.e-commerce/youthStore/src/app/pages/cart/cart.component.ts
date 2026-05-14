import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartService = inject(CartService);
  authService = inject(AuthService);

  getTotal() {
    let total = 0;
    this.cartService.cart$.subscribe(cart => {
      total = cart.reduce((acc, item) => acc + (item.price * item.count), 0);
    });
    return total;
  }
}
