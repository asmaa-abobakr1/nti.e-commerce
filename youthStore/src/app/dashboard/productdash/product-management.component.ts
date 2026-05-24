import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../core/service/product-service';
import { FormsModule } from '@angular/forms';
import { Product, Category, SubCategory } from '../../models/interfaces';

interface ProductForm {
  title: string;
  price: number;
  desc: string;
  stock: number;
  gender: 'boys' | 'girls' | 'unisex';
  season: string;
  category: string;
  subCategory: string;
  isNewArrival: boolean;
  isBestSeller: boolean;
}

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">Products Inventory</h3>
      <button class="btn btn-primary rounded-pill px-4" (click)="openForm()">
        <i class="fas fa-plus me-2"></i>Add Product
      </button>
    </div>

    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let prod of products">
            <td>
              <div class="d-flex align-items-center gap-3">
                <img [src]="prod.img" width="40" height="40" class="rounded-3" style="object-fit: cover;">
                <span class="fw-bold small">{{prod.title}}</span>
              </div>
            </td>
            <td>{{prod.category?.title}} / {{prod.subCategory?.title}}</td>
            <td class="fw-bold text-primary">\${{prod.price}}</td>
            <td>{{prod.stock}}</td>
            <td>
              <div class="d-flex gap-1">
                <span class="badge rounded-pill cursor-pointer" 
                      [ngClass]="prod.isNewArrival ? 'bg-primary' : 'bg-light text-dark border'"
                      (click)="toggleStatus(prod, 'isNewArrival')"
                      title="Toggle New Arrival">
                  New
                </span>
                <span class="badge rounded-pill cursor-pointer" 
                      [ngClass]="prod.isBestSeller ? 'bg-secondary' : 'bg-light text-dark border'"
                      (click)="toggleStatus(prod, 'isBestSeller')"
                      title="Toggle Best Seller">
                  Best
                </span>
              </div>
            </td>
            <td>
              <button class="btn btn-sm btn-light rounded-circle me-2" (click)="editProduct(prod)"><i class="fas fa-edit"></i></button>
              <button class="btn btn-sm btn-light text-danger rounded-circle" (click)="deleteProduct(prod._id)"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Full Add/Edit Modal -->
    <div class="modal fade show d-block" *ngIf="showForm" style="background: rgba(0,0,0,0.5)">
       <div class="modal-dialog modal-lg modal-dialog-centered">
         <div class="modal-content rounded-5 border-0 p-4">
            <h4 class="fw-bold mb-4">{{editingId ? 'Edit' : 'Add'}} Product</h4>
            <div class="alert alert-danger rounded-4 small" *ngIf="formError">
              {{ formError }}
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="small fw-bold">Title</label>
                <input type="text" class="form-control rounded-pill" [(ngModel)]="currentProd.title">
              </div>
              <div class="col-md-6">
                <label class="small fw-bold">Price</label>
                <input type="number" class="form-control rounded-pill" min="0" step="1" [(ngModel)]="currentProd.price">
              </div>
              <div class="col-12">
                <label class="small fw-bold">Description</label>
                <textarea class="form-control rounded-4" rows="3" [(ngModel)]="currentProd.desc"></textarea>
              </div>
              <div class="col-md-4">
                <label class="small fw-bold">Stock</label>
                <input type="number" class="form-control rounded-pill" min="0" step="1" [(ngModel)]="currentProd.stock">
              </div>
              <div class="col-md-4">
                <label class="small fw-bold">Gender</label>
                <select class="form-select rounded-pill" [(ngModel)]="currentProd.gender">
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="unisex">Unisex</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="small fw-bold">Season</label>
                <input type="text" class="form-control rounded-pill" [(ngModel)]="currentProd.season" placeholder="Summer 2026">
              </div>
              <div class="col-md-6">
                <label class="small fw-bold">Category</label>
                <select class="form-select rounded-pill" [(ngModel)]="currentProd.category">
                  <option *ngFor="let cat of categories" [value]="cat._id">{{cat.title}}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="small fw-bold">SubCategory</label>
                <select class="form-select rounded-pill" [(ngModel)]="currentProd.subCategory">
                  <option *ngFor="let sub of filteredSubCategories" [value]="sub._id">{{sub.title}}</option>
                </select>
              </div>
               <div class="col-md-6 mt-3">
                 <div class="form-check form-switch">
                   <input class="form-check-input" type="checkbox" id="isNewArrival" [(ngModel)]="currentProd.isNewArrival">
                   <label class="form-check-label fw-bold small" for="isNewArrival">Mark as New Arrival</label>
                 </div>
               </div>
               <div class="col-md-6 mt-3">
                 <div class="form-check form-switch">
                   <input class="form-check-input" type="checkbox" id="isBestSeller" [(ngModel)]="currentProd.isBestSeller">
                   <label class="form-check-label fw-bold small" for="isBestSeller">Mark as Best Seller</label>
                 </div>
               </div>
               <div class="col-12 mt-2">
                 <label class="small fw-bold">Product Image (File)</label>
                 <input type="file" class="form-control rounded-pill" (change)="onFileSelected($event)">
               </div>
            </div>
            <div class="d-flex gap-2 mt-4">
              <button class="btn btn-primary rounded-pill px-5 py-2 fw-bold" (click)="saveProduct()">SAVE PRODUCT</button>
              <button class="btn btn-light rounded-pill px-5 py-2" (click)="showForm = false">CANCEL</button>
            </div>
         </div>
       </div>
    </div>
  `
})
export class ProductManagementComponent implements OnInit {
  private productService = inject(ProductService);
  products: Product[] = [];
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  
  showForm = false;
  editingId: string | null = null;
  selectedFile: File | null = null;
  formError = '';

  currentProd: ProductForm = {
    title: '',
    price: 0,
    desc: '',
    stock: 0,
    gender: 'unisex',
    season: '',
    category: '',
    subCategory: '',
    isNewArrival: false,
    isBestSeller: false
  };

  ngOnInit() {
    this.load();
    this.productService.getCategories().subscribe(res => this.categories = res.data.categories);
    this.productService.getSubCategories().subscribe(res => {
       
       this.subCategories = (res.data as any).subcategories || (res.data as any).subCategories;
    });
  }

  get filteredSubCategories(): SubCategory[] {
    return this.subCategories.filter(s => {
      if (Array.isArray(s.category)) {
        return s.category.some(cat => {
          const catId = typeof cat === 'string' ? cat : cat?._id;
          return catId === this.currentProd.category;
        });
      }
      const catId = typeof s.category === 'string' ? s.category : (s.category as any)?._id;
      return catId === this.currentProd.category;
    });
  }

  load() {
    this.productService.getProducts().subscribe(res => this.products = res.data.products);
  }

  openForm() {
    this.editingId = null;
    this.selectedFile = null;
    this.formError = '';
    this.currentProd = {
      title: '', price: 0, desc: '', stock: 0,
      gender: 'unisex', season: '', category: this.categories[0]?._id || '',
      subCategory: '', isNewArrival: false, isBestSeller: false
    };
    this.showForm = true;
  }

  editProduct(prod: Product) {
    this.editingId = prod._id;
    this.selectedFile = null;
    this.formError = '';
    this.currentProd = {
      title: prod.title,
      price: prod.price,
      desc: prod.desc,
      stock: prod.stock,
      gender: prod.gender,
      season: prod.season || '',
      category: prod.category?._id || '',
      subCategory: prod.subCategory?._id || '',
      isNewArrival: prod.isNewArrival || false,
      isBestSeller: prod.isBestSeller || false
    };
    this.showForm = true;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  saveProduct() {
    this.formError = '';
    this.currentProd.price = Number(this.currentProd.price);
    this.currentProd.stock = Number(this.currentProd.stock);

    if (!Number.isFinite(this.currentProd.price) || this.currentProd.price < 0) {
      this.formError = 'Price cannot be negative.';
      return;
    }

    if (!Number.isFinite(this.currentProd.stock) || this.currentProd.stock < 0) {
      this.formError = 'Stock cannot be negative.';
      return;
    }

    const formData = new FormData();
    const prodObj = this.currentProd as any;
    Object.keys(prodObj).forEach(key => {
      formData.append(key, prodObj[key].toString());
    });
    if (this.selectedFile) {
      formData.append('img', this.selectedFile);
    }

    if (this.editingId) {
      this.productService.updateProduct(this.editingId, formData).subscribe(() => {
        this.load();
        this.showForm = false;
      });
    } else {
      this.productService.createProduct(formData).subscribe(() => {
        this.load();
        this.showForm = false;
      });
    }
  }

  deleteProduct(id: string) {
    if (confirm('Delete product?')) {
      this.productService.deleteProduct(id).subscribe(() => this.load());
    }
  }

  toggleStatus(prod: Product, field: 'isNewArrival' | 'isBestSeller') {
    const newValue = !prod[field];
    const formData = new FormData();
    formData.append(field, newValue.toString());
    
    this.productService.updateProduct(prod._id, formData).subscribe(() => {
      prod[field] = newValue;
    });
  }
}
