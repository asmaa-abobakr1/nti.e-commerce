import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../../../services/settings.service';
import { MessageService } from '../../../services/message.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-5">
      <div class="text-center mb-5">
        <h2 class="fw-bolder display-4 mb-2">
          {{ settings?.contactTitle || "Get in Touch" }}
        </h2>
        <p class="text-gray lead">
          {{ settings?.contactSubTitle || "Have questions? We're here to help (or just to chat about fashion)." }}
        </p>
      </div>

      <div class="row g-5">
        <div class="col-lg-5">
          <div class="card border-0 shadow-sm rounded-5 p-4 h-100 bg-white">
            <h4 class="fw-bold mb-4">Contact Info</h4>
            
            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="bg-primary p-3 rounded-4 text-white">
                <i class="fas fa-map-marker-alt fs-5"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-0">Location</h6>
                <p class="text-gray mb-0 small">{{ settings?.address || "123 Fashion St, Cairo, Egypt" }}</p>
              </div>
            </div>

            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="bg-primary p-3 rounded-4 text-white">
                <i class="fas fa-phone-alt fs-5"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-0">Phone</h6>
                <p class="text-gray mb-0 small">{{ settings?.phone || "+20 123 456 7890" }}</p>
              </div>
            </div>

            <div class="d-flex align-items-center gap-3 mb-4">
              <div class="bg-primary p-3 rounded-4 text-white">
                <i class="fas fa-envelope fs-5"></i>
              </div>
              <div>
                <h6 class="fw-bold mb-0">Email</h6>
                <p class="text-gray mb-0 small">{{ settings?.contactEmail || "hello@youthstore.com" }}</p>
              </div>
            </div>

            <div class="mt-4 rounded-4 overflow-hidden border shadow-sm" style="height: 250px;" *ngIf="safeMapUrl">
              <!-- Embedded Google Map -->
              <iframe 
                [src]="safeMapUrl" 
                width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy">
              </iframe>
            </div>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="card border-0 shadow-sm rounded-5 p-5 h-100 bg-white">
            <h4 class="fw-bold mb-4">Send us a Message</h4>
            
            <div *ngIf="submitted" class="alert alert-success rounded-4 p-4 text-center mb-0">
              <i class="fas fa-check-circle fa-3x mb-3"></i>
              <h5 class="fw-bold">Message Sent!</h5>
              <p class="mb-0">Thank you for reaching out. We will get back to you soon.</p>
              <button class="btn btn-link text-primary fw-bold mt-3" (click)="submitted = false">Send another message</button>
            </div>

            <form *ngIf="!submitted" (ngSubmit)="submitMessage()">
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Name</label>
                  <input type="text" class="form-control rounded-pill px-4" [(ngModel)]="msgData.name" name="name" placeholder="Your Name" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label small fw-bold">Email</label>
                  <input type="email" class="form-control rounded-pill px-4" [(ngModel)]="msgData.email" name="email" placeholder="Your Email" required>
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Subject</label>
                  <input type="text" class="form-control rounded-pill px-4" [(ngModel)]="msgData.subject" name="subject" placeholder="How can we help?" required>
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Message</label>
                  <textarea class="form-control rounded-4 px-4 py-3" rows="5" [(ngModel)]="msgData.content" name="content" placeholder="Write your message here..." required></textarea>
                </div>
                <div class="col-12 pt-3">
                  <button type="submit" class="btn btn-primary rounded-pill px-5 py-3 fw-bold shadow-lg" [disabled]="loading">
                    {{ loading ? 'Sending...' : 'Send Message' }} <i class="fas fa-paper-plane ms-2"></i>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ContactComponent implements OnInit {
  settingsService = inject(SettingsService);
  messageService = inject(MessageService);
  sanitizer = inject(DomSanitizer);

  settings: any;
  safeMapUrl: SafeResourceUrl | null = null;
  
  msgData = { name: '', email: '', subject: '', content: '' };
  submitted = false;
  loading = false;

  ngOnInit() {
    this.settingsService.getSettings().subscribe(res => {
      this.settings = res.data.settings;
      if (this.settings?.googleMapUrl) {
        this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.settings.googleMapUrl);
      }
    });
  }

  submitMessage() {
    this.loading = true;
    this.messageService.sendMessage(this.msgData).subscribe({
      next: () => {
        this.submitted = true;
        this.loading = false;
        this.msgData = { name: '', email: '', subject: '', content: '' };
      },
      error: () => {
        this.loading = false;
        alert('Failed to send message. Please try again.');
      }
    });
  }
}
