import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Product } from '../core/models/product.model';

/**
 * Global service to control the fullscreen modal.
 * It holds the currently selected product and a visibility flag.
 * Components can subscribe to these streams to react to open/close events.
 */
@Injectable({ providedIn: 'root' })
export class ModalService {
  /** Product to display in the modal */
  private productSubject = new Subject<Product | null>();
  /** Visibility flag */
  private visibleSubject = new Subject<boolean>();

  /** Observable streams */
  product$ = this.productSubject.asObservable();
  visible$ = this.visibleSubject.asObservable();

  /** Open the modal with a specific product */
  open(product: Product): void {
    this.productSubject.next(product);
    this.visibleSubject.next(true);
  }

  /** Close the modal */
  close(): void {
    this.visibleSubject.next(false);
    this.productSubject.next(null);
  }
}
