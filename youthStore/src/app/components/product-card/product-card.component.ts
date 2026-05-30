import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  constructor(private router: Router, private modalSrv: ModalService) {}

  @Input() product!: Product;
  @Input() layout: 'grid' | 'compact' = 'grid';
  @Output() addToCart = new EventEmitter<Product>();

  /** Open modal using global service */
  openModal(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    this.modalSrv.open(this.product);
  }

  onAddToCartWithStop(event: Event) {
    event.stopPropagation();
    this.onAddToCart();
  }

  onAddToCart() {
    this.addToCart.emit(this.product);
  }
}
