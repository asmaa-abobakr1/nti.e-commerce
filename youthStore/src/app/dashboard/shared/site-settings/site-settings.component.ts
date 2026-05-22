import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../../services/settings.service';
import { FormsModule } from '@angular/forms';
import { Settings } from '../../../models/interfaces';

@Component({
  selector: 'app-site-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h3 class="fw-bold mb-4">Site Customization</h3>
    <div class="row g-4" *ngIf="settings">
      <!-- Global Settings -->
      <div class="col-12"><h5 class="fw-bold text-primary border-bottom pb-2">Global Settings</h5></div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Site Name</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.siteName">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Footer About Text</label>
        <textarea class="form-control rounded-4" rows="2" [(ngModel)]="settings.footerAboutText"></textarea>
      </div>

      <!-- Hero Section -->
      <div class="col-12 mt-4"><h5 class="fw-bold text-primary border-bottom pb-2">Hero Section</h5></div>
      <div class="col-md-4">
        <label class="small fw-bold mb-2">Hero Badge</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.heroBadge">
      </div>
      <div class="col-md-4">
        <label class="small fw-bold mb-2">Hero Title Part 1</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.heroTitle">
      </div>
      <div class="col-md-4">
        <label class="small fw-bold mb-2">Hero Title Part 2</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.heroTitlePart2">
      </div>
      <div class="col-12">
        <label class="small fw-bold mb-2">Hero Subtitle</label>
        <textarea class="form-control rounded-4" rows="2" [(ngModel)]="settings.heroSubtitle"></textarea>
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Shop Button Text</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.shopBtnText">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Lookbook Button Text</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.lookbookBtnText">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Hero Image</label>
        <input type="file" class="form-control rounded-pill" (change)="onHeroFileSelected($event)" accept="image/*">
        <img *ngIf="settings.heroImage" [src]="settings.heroImage" class="img-thumbnail mt-2" width="150">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Quality Card Text</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.qualityCardText">
      </div>

      <!-- Content Sections -->
      <div class="col-12 mt-4"><h5 class="fw-bold text-primary border-bottom pb-2">Home Sections</h5></div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">New Arrivals Title</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.newArrivalsTitle">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">New Arrivals Subtitle</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.newArrivalsSubTitle">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Best Sellers Title</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.bestSellersTitle">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Best Sellers Subtitle</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.bestSellersSubTitle">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Testimonials Title</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.testimonialsTitle">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Testimonials Subtitle</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.testimonialsSubTitle">
      </div>

      <!-- Contact Info -->
      <div class="col-12 mt-4"><h5 class="fw-bold text-primary border-bottom pb-2">Contact Page</h5></div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Contact Title</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.contactTitle">
      </div>
      <div class="col-md-6">
        <label class="small fw-bold mb-2">Contact Subtitle</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.contactSubTitle">
      </div>
      <div class="col-md-4">
        <label class="small fw-bold mb-2">Contact Email</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.contactEmail">
      </div>
      <div class="col-md-4">
        <label class="small fw-bold mb-2">Contact Phone</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.phone">
      </div>
      <div class="col-md-4">
        <label class="small fw-bold mb-2">Contact Address</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.address">
      </div>
      <div class="col-12">
        <label class="small fw-bold mb-2">Google Map Embed URL</label>
        <input type="text" class="form-control rounded-pill" [(ngModel)]="settings.googleMapUrl">
      </div>

      <!-- Marketing Slider Management -->
      <div class="col-12 mt-4"><h5 class="fw-bold text-primary border-bottom pb-2">Marketing Slider</h5></div>
      <div class="col-12">
        <label class="small fw-bold mb-2 d-block">Images Management</label>
        <div class="d-flex flex-wrap gap-3 mb-3">
          <!-- Existing Images -->
          <div *ngFor="let img of settings.marketingImages; let i = index" class="position-relative">
            <img [src]="img" class="img-thumbnail" width="120" style="height: 80px; object-fit: cover;">
            <button class="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-n2 shadow-sm" style="width: 24px; height: 24px; padding: 0;" (click)="removeExistingImage(i)">
              <i class="fas fa-times small"></i>
            </button>
          </div>
          <!-- New Files Preview -->
          <div *ngFor="let file of selectedMarketingFiles; let i = index" class="position-relative">
            <div class="img-thumbnail bg-light d-flex align-items-center justify-content-center text-primary" width="120" style="height: 80px; width: 120px; font-size: 10px; overflow: hidden;">
              {{ file.name }}
            </div>
            <button class="btn btn-danger btn-sm rounded-circle position-absolute top-0 end-0 m-n2 shadow-sm" style="width: 24px; height: 24px; padding: 0;" (click)="removeNewFile(i)">
              <i class="fas fa-times small"></i>
            </button>
          </div>
          <!-- Add Button -->
          <label class="btn btn-outline-primary border-dashed d-flex align-items-center justify-content-center rounded-3" style="width: 120px; height: 80px; cursor: pointer;">
            <i class="fas fa-plus fa-2x"></i>
            <input type="file" class="d-none" (change)="onMarketingFileAdded($event)" accept="image/*">
          </label>
        </div>
        <p class="text-gray small"><i class="fas fa-info-circle me-1"></i> You can add images one by one. Don't forget to save changes.</p>
      </div>

      <div class="col-12 mt-4">
        <button class="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-lg" (click)="saveSettings()" [disabled]="loading">
          <i class="fas fa-save me-2"></i>{{ loading ? 'SAVING...' : 'SAVE ALL CHANGES' }}
        </button>
      </div>
    </div>
  `
})
export class SiteSettingsComponent implements OnInit {
  private settingsService = inject(SettingsService);
  settings: Settings | null = null;
  selectedHeroFile: File | null = null;
  selectedMarketingFiles: File[] = [];
  loading = false;

  ngOnInit() {
    this.settingsService.getSettings().subscribe(res => {
      this.settings = res.data.settings;
    });
  }

  onHeroFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedHeroFile = input.files[0];
    }
  }

  onMarketingFileAdded(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedMarketingFiles.push(input.files[0]);
      
      input.value = '';
    }
  }

  removeExistingImage(index: number) {
    if (this.settings) {
      this.settings.marketingImages.splice(index, 1);
    }
  }

  removeNewFile(index: number) {
    this.selectedMarketingFiles.splice(index, 1);
  }

  saveSettings() {
    if (!this.settings) return;
    this.loading = true;
    const formData = new FormData();
    
    
    const settingsObj = this.settings as any;
    Object.keys(settingsObj).forEach(key => {
      if (key === 'heroImage' || key === 'marketingImages' || key === '_id' || key === 'createdAt' || key === 'updatedAt' || key === '__v') return;
      
      let value = settingsObj[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });
    
    
    if (this.selectedHeroFile) {
      formData.append('heroImage', this.selectedHeroFile);
    } else {
      formData.append('heroImage', this.settings.heroImage);
    }

    
    
    formData.append('marketingImages', this.settings.marketingImages.join(','));
    
    
    if (this.selectedMarketingFiles.length > 0) {
      this.selectedMarketingFiles.forEach(file => {
        formData.append('marketingImages', file);
      });
    }

    this.settingsService.updateSettings(formData).subscribe({
      next: (res) => {
        this.loading = false;
        alert('All changes saved successfully!');
        this.settings = res.data.settings;
        this.selectedHeroFile = null;
        this.selectedMarketingFiles = [];
      },
      error: (err) => {
        this.loading = false;
        console.error('Save failed:', err);
        alert('Failed to save settings.');
      }
    });
  }
}
