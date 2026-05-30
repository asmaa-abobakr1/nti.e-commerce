import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/service/auth-service';
import { CartService } from '../../core/service/cart-service';
import { SettingsService } from '../../services/settings.service';
import { ProductService } from '../../core/service/product-service';
import { Category, SubCategory, Settings } from '../../models/interfaces';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(public authService: AuthService, public cartService: CartService, private settingsService: SettingsService, private productService: ProductService) {}
  
  settings: Settings | null = null;
  categories: Category[] = [];
  subCategories: SubCategory[] = [];

  sidebarOpen = false;
  expandedCat: string | null = null;

  ngOnInit() {
    this.settingsService.getSettings().subscribe(res => {
      this.settings = res.data.settings;
    });

    this.productService.getCategories().subscribe(res => {
      this.categories = res.data.categories;
    });

    this.productService.getSubCategories().subscribe(res => {
      this.subCategories = (res.data as any).subcategories || (res.data as any).subCategories;
    });
  }

  getSubsForCat(catId: string): SubCategory[] {
    return this.subCategories.filter(s => {
      if (Array.isArray(s.category)) {
        return s.category.some(cat => {
          const id = typeof cat === 'string' ? cat : cat?._id;
          return id === catId;
        });
      }
      const id = typeof s.category === 'string' ? s.category : (s.category as any)?._id;
      return id === catId;
    });
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
    document.body.style.overflow = this.sidebarOpen ? 'hidden' : '';
  }

  closeSidebar() {
    this.sidebarOpen = false;
    this.expandedCat = null;
    document.body.style.overflow = '';
  }

  toggleCategory(event: Event, catId: string) {
    event.preventDefault();
    event.stopPropagation();
    this.expandedCat = this.expandedCat === catId ? null : catId;
  }




}
