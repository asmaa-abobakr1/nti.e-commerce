import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../services/settings.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-site-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3 class="fw-bold mb-4">Site Customization</h3>
    <div class="row g-4" *ngIf="settings">
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Site Name</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.siteName">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Hero Section Title</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.heroTitle">
      </div>
      <div class="col-12">
        <label class="small fw-bold mb-2">Hero Section Subtitle</label>
        <textarea class="form-control rounded-4" rows="2" [(ngModel)]="settings.heroSubtitle"></textarea>
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">New Arrivals Title</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.newArrivalsTitle">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Contact Phone</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.phone">
      </div>
      <div class="col-12">
        <button class="btn btn-primary rounded-pill px-5 py-2 fw-bold" (click)="saveSettings()">
          <i class="fas fa-save me-2"></i>Save Changes
        </button>
      </div>
    </div>
  `
})
export class SiteSettingsComponent implements OnInit {
  settingsService = inject(SettingsService);
  settings: any = null;

  ngOnInit() {
    this.settingsService.getSettings().subscribe(res => {
      this.settings = res.data.settings;
    });
  }

  saveSettings() {
    this.settingsService.updateSettings(this.settings).subscribe(() => {
      alert('Settings updated successfully!');
    });
  }
}
