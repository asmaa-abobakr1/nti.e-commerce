import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AuthService } from './auth-service';
import { CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';
import { ApiResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private userUrl = `${environment.apiUrl}/users`;

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();
  cartCount$ = this.cart$.pipe(
    map(cart => cart.reduce((total, item) => total + item.count, 0))
  );

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
      try {
        this.cartSubject.next(this.normalizeCart(JSON.parse(savedCart)));
      } catch {
        localStorage.removeItem('cart');
        this.cartSubject.next([]);
      }
    }
  }

  private fetchUserCart() {
    this.http.get<ApiResponse<{ user: { cart: CartItem[] } }>>(`${this.userUrl}/me`).subscribe((res) => {
      this.cartSubject.next(this.normalizeCart(res.data.user.cart));
    });
  }

  addToCart(product: Product, count: number = 1) {
    const currentCart = [...this.cartSubject.value];
    const existingItem = currentCart.find(item => this.getProductId(item.product) === product._id);

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
    const item = currentCart.find(i => this.getProductId(i.product) === productId);
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
    const currentCart = this.cartSubject.value.filter(item => this.getProductId(item.product) !== productId);
    this.updateCart(currentCart);
  }

  acceptNewPrice(productId: string, newPrice: number) {
    const currentCart = [...this.cartSubject.value];
    const item = currentCart.find(i => this.getProductId(i.product) === productId);
    if (item) {
      item.price = newPrice;
      item.isPriceChanged = false;
      this.updateCart(currentCart);
    }
  }

  private updateCart(cart: CartItem[]) {
    this.cartSubject.next(cart);
    if (this.authService.isLoggedIn()) {
      this.http.patch<ApiResponse<{ cart: CartItem[] }>>(`${this.userUrl}/updateCart`, {
        cart: this.toApiCart(cart)
      }).subscribe({
        next: (res) => this.cartSubject.next(this.normalizeCart(res.data.cart || cart)),
        error: () => this.fetchUserCart()
      });
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

  getItemProductId(item: CartItem): string {
    return this.getProductId(item.product);
  }

  private getProductId(product: Product | string | null | undefined): string {
    if (!product) return '';
    if (typeof product === 'string') return product;
    return product._id || '';
  }

  private toApiCart(cart: CartItem[]) {
    return cart
      .map(item => ({
        product: this.getProductId(item.product),
        count: item.count,
        price: item.price,
        isPriceChanged: item.isPriceChanged
      }))
      .filter(item => item.product);
  }

  private normalizeCart(cart: CartItem[] | null | undefined): CartItem[] {
    return (cart || []).filter(item => this.getProductId(item?.product));
  }
}
