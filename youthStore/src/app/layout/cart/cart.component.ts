import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from '../../core/service/cart-service';
import { AuthService } from '../../core/service/auth-service';

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

  validItems$: Observable<any[]> = this.cartService.cart$.pipe(
    map(cart => cart.filter(item => !item.isPriceChanged))
  );

  changedItems$: Observable<any[]> = this.cartService.cart$.pipe(
    map(cart => cart.filter(item => item.isPriceChanged))
  );

  total$: Observable<number> = this.cartService.cart$.pipe(
    map(cart => cart.filter(item => !item.isPriceChanged)
                    .reduce((acc, item) => acc + (item.price * item.count), 0))
  );

  acceptNewPrice(productId: string, newPrice: number) {
    this.cartService.acceptNewPrice(productId, newPrice);
  }
}
