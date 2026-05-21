import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <div class="card border-0 shadow-sm rounded-5 p-5 bg-white max-width-800 mx-auto">
        <h2 class="fw-bolder mb-4 text-center">Privacy <span class="text-primary">Policy</span></h2>
        
        <p class="text-gray mb-4">Last Updated: May 14, 2026</p>

        <section class="mb-5">
          <h5 class="fw-bold mb-3">1. Information We Collect</h5>
          <p class="text-gray">We collect information to provide better services to our users. This includes your name, email address, phone number, and shipping address when you create an account or make a purchase.</p>
        </section>

        <section class="mb-5">
          <h5 class="fw-bold mb-3">2. How We Use Information</h5>
          <p class="text-gray">We use the information we collect to process your orders, communicate with you about your account, and send you promotional offers if you have opted in to receive them.</p>
        </section>

        <section class="mb-5">
          <h5 class="fw-bold mb-3">3. Data Security</h5>
          <p class="text-gray">We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
        </section>

        <section class="mb-5">
          <h5 class="fw-bold mb-3">4. Third-Party Disclosure</h5>
          <p class="text-gray">We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information unless we provide you with advance notice.</p>
        </section>

        <div class="text-center mt-5">
          <p class="text-gray small">If you have any questions regarding this privacy policy, you may contact us at privacy&#64;youthstore.com</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .max-width-800 { max-width: 800px; }
  `]
})
export class PrivacyComponent {}
