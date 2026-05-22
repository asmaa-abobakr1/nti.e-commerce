import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { CartItem, Product, ApiResponse } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private userUrl = 'http://localhost:5000/api/v1/users';

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCart();
    this.authService.user$.subscribe(user => {
      if (user) {
        this.fetchUserCart();
      } else {
        this.loadCart(); 
      }
    });
  }

  private loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  private fetchUserCart() {
    this.http.get<ApiResponse<{ user: { cart: CartItem[] } }>>(`${this.userUrl}/me`).subscribe((res) => {
      this.cartSubject.next(res.data.user.cart || []);
    });
  }

  addToCart(product: Product, count: number = 1) {
    const currentCart = [...this.cartSubject.value];
    const existingItem = currentCart.find(item => item.product._id === product._id);

    if (existingItem) {
      existingItem.count += count;
    } else {
      currentCart.push({
        product,
        count,
        price: product.price,
        isPriceChanged: false
      });
    }

    this.updateCart(currentCart);
  }

  updateCount(productId: string, count: number) {
    const currentCart = [...this.cartSubject.value];
    const item = currentCart.find(i => i.product._id === productId);
    if (item) {
      item.count = count;
      if (item.count <= 0) {
        this.removeFromCart(productId);
      } else {
        this.updateCart(currentCart);
      }
    }
  }

  removeFromCart(productId: string) {
    const currentCart = this.cartSubject.value.filter(item => item.product._id !== productId);
    this.updateCart(currentCart);
  }

  acceptNewPrice(productId: string, newPrice: number) {
    const currentCart = [...this.cartSubject.value];
    const item = currentCart.find(i => i.product._id === productId);
    if (item) {
      item.price = newPrice;
      item.isPriceChanged = false;
      this.updateCart(currentCart);
    }
  }

  private updateCart(cart: CartItem[]) {
    this.cartSubject.next(cart);
    if (this.authService.isLoggedIn()) {
      
      this.http.patch<ApiResponse<{ cart: CartItem[] }>>(`${this.userUrl}/updateCart`, { cart }).subscribe();
    } else {
      
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }

  clearCart() {
    this.cartSubject.next([]);
    localStorage.removeItem('cart');
    if (this.authService.isLoggedIn()) {
      this.http.patch<ApiResponse<{ cart: CartItem[] }>>(`${this.userUrl}/updateCart`, { cart: [] }).subscribe();
    }
  }
}
