import { Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { ShopComponent } from './layout/product-list/shop.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './layout/signup/signup.component';
import { CartComponent } from './layout/cart/cart.component';
import { CheckoutComponent } from './layout/checkout/checkout.component';
import { ProfileComponent } from './layout/account/profile.component';
import { DashboardComponent } from './dashboard/dashboard';

import { TermsConditionsComponent } from './layout/shared/terms-conditions/terms-conditions.component';
import { adminGuard } from './guards/admin.guard';
import { guestGuard } from './guards/guest.guard';

import { ReportPageComponent } from './dashboard/report/report-page.component';
import { AboutComponent } from './layout/shared/about/about.component';
import { ContactComponent } from './layout/shared/contact/contact.component';
import { PrivacyComponent } from './layout/shared/privacy/privacy.component';
import { TestimonialsComponent } from './layout/shared/testimonials/testimonials.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [guestGuard] },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'terms', component: TermsConditionsComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { 
    path: 'admin', 
    component: DashboardComponent, 
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./dashboard/admin/dashboard-home.component').then(m => m.DashboardHomeComponent) },
      { path: 'products', loadComponent: () => import('./dashboard/productdash/product-management.component').then(m => m.ProductManagementComponent) },
      { path: 'categories', loadComponent: () => import('./dashboard/shared/category-management/category-management.component').then(m => m.CategoryManagementComponent) },
      { path: 'subcategories', loadComponent: () => import('./dashboard/shared/subcategory-management/subcategory-management.component').then(m => m.SubCategoryManagementComponent) },
      { path: 'users', loadComponent: () => import('./dashboard/users/user-management.component').then(m => m.UserManagementComponent) },
      { path: 'orders', loadComponent: () => import('./dashboard/order/order-management.component').then(m => m.OrderManagementComponent) },
      { path: 'settings', loadComponent: () => import('./dashboard/shared/site-settings/site-settings.component').then(m => m.SiteSettingsComponent) },
      { path: 'reviews', loadComponent: () => import('./dashboard/testomonial/review-management.component').then(m => m.ReviewManagementComponent) },
      { path: 'messages', loadComponent: () => import('./dashboard/ads/message-management.component').then(m => m.MessageManagementComponent) },
      { path: 'reports', component: ReportPageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

