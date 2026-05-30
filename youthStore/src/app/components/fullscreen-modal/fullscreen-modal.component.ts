import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { BlurService } from '../../services/blur.service';
import { Product } from '../../core/models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-fullscreen-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fullscreen-modal.component.html',
  styleUrls: ['./fullscreen-modal.component.css']
})
export class FullscreenModalComponent implements OnInit, OnDestroy {
  /** currently selected product */
  product: Product | null = null;
  /** modal visibility flag */
  visible = false;

  private subs = new Subscription();

  @Output() close = new EventEmitter<void>();

  constructor(public modalSrv: ModalService, private blurService: BlurService) {}

  ngOnInit(): void {
    this.subs.add(this.modalSrv.product$.subscribe(p => (this.product = p)));
    this.subs.add(
      this.modalSrv.visible$.subscribe(v => {
        this.visible = v;
        if (v) {
          this.blurService.showBlur();
          document.body.classList.add('modal-open');
        } else {
          this.blurService.hideBlur();
          document.body.classList.remove('modal-open');
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    this.blurService.hideBlur();
    document.body.classList.remove('modal-open');
  }

  /** Called when backdrop is clicked */
  onBackgroundClick(): void {
    this.modalSrv.close();
    this.close.emit();
  }
}
