import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  authService = inject(AuthService);
  cartService = inject(CartService);
  settingsService = inject(SettingsService);
  
  settings: any = null;

  constructor() {
    this.settingsService.getSettings().subscribe(res => {
      this.settings = res.data.settings;
    });
  }
}
