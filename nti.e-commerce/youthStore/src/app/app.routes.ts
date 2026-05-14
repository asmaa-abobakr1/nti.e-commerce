import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ShopComponent } from './pages/shop/shop.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

import { TermsConditionsComponent } from './pages/terms-conditions/terms-conditions.component';
import { adminGuard } from './guards/admin.guard';

import { ReportPageComponent } from './pages/report-page/report-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'terms', component: TermsConditionsComponent },
  { 
    path: 'admin', 
    component: AdminDashboardComponent, 
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./pages/admin-dashboard/dashboard-home/dashboard-home.component').then(m => m.DashboardHomeComponent) },
      { path: 'products', loadComponent: () => import('./pages/admin-dashboard/product-management/product-management.component').then(m => m.ProductManagementComponent) },
      { path: 'categories', loadComponent: () => import('./pages/admin-dashboard/category-management/category-management.component').then(m => m.CategoryManagementComponent) },
      { path: 'subcategories', loadComponent: () => import('./pages/admin-dashboard/subcategory-management/subcategory-management.component').then(m => m.SubCategoryManagementComponent) },
      { path: 'users', loadComponent: () => import('./pages/admin-dashboard/user-management/user-management.component').then(m => m.UserManagementComponent) },
      { path: 'orders', loadComponent: () => import('./pages/admin-dashboard/order-management/order-management.component').then(m => m.OrderManagementComponent) },
      { path: 'settings', loadComponent: () => import('./pages/admin-dashboard/site-settings/site-settings.component').then(m => m.SiteSettingsComponent) },
      { path: 'reports', component: ReportPageComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];
