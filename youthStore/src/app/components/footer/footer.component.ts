import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  settingsService = inject(SettingsService);
  settings: any;

  ngOnInit() {
    this.settingsService.getSettings().subscribe(res => {
      this.settings = res.data.settings;
    });
  }
}
