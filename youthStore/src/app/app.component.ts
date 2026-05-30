import { Component, inject } from '@angular/core';
import { BlurService } from './services/blur.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { FullscreenModalComponent } from './components/fullscreen-modal/fullscreen-modal.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, FullscreenModalComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private router: Router;
  private route: ActivatedRoute;
  public blurService: BlurService;
  blurActive = false;
  private blurServiceState = false;

  constructor(router: Router, route: ActivatedRoute, blurService: BlurService) {
    this.router = router;
    this.route = route;
    this.blurService = blurService;

    // Remove route data blur handling – only use BlurService for modal blur
    this.router.events.pipe(filter((event:any)=>event instanceof NavigationEnd)).subscribe(() => {
      // Scroll to top on navigation
      window.scrollTo(0,0);
      // Auto-clear any lingering blur or scroll lock on navigation
      this.blurService.hideBlur();
      document.body.classList.remove('modal-open');
    });
    // Subscribe to BlurService for modal‑triggered blur
    this.blurService.blur$.subscribe(state => {
      this.blurServiceState = state;
      this.blurActive = state;
    });
  }

  title = 'youthStore';
}
