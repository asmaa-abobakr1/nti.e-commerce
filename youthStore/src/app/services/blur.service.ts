import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlurService {
  private blurSubject = new BehaviorSubject<boolean>(false);
  /** Observable for components to subscribe to blur state changes */
  readonly blur$: Observable<boolean> = this.blurSubject.asObservable();

  /** Show blur overlay */
  showBlur(): void {
    this.blurSubject.next(true);
  }

  /** Hide blur overlay */
  hideBlur(): void {
    this.blurSubject.next(false);
  }
}
