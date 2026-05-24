import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../models/interfaces';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Input() layout: 'grid' | 'compact' = 'grid'; 
  @Output() addToCart = new EventEmitter<Product>();

  showModal = false;

  openModal() {
    this.showModal = true;
    document.body.classList.add('modal-open');
  }

  closeModal(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.showModal = false;
    document.body.classList.remove('modal-open');
  }

  onAddToCartWithStop(event: Event) {
    event.stopPropagation();
    this.onAddToCart();
  }

  onAddToCart() {
    this.addToCart.emit(this.product);
  }
}
