import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';

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
           <div class="row g-3">
             <div class="col-md-6">
               <label class="small fw-bold">Title</label>
               <input type="text" class="form-control rounded-pill" [(ngModel)]="currentProd.title">
             </div>
             <div class="col-md-6">
               <label class="small fw-bold">Price</label>
               <input type="number" class="form-control rounded-pill" [(ngModel)]="currentProd.price">
             </div>
             <div class="col-12">
               <label class="small fw-bold">Description</label>
               <textarea class="form-control rounded-4" rows="3" [(ngModel)]="currentProd.desc"></textarea>
             </div>
             <div class="col-md-4">
               <label class="small fw-bold">Stock</label>
               <input type="number" class="form-control rounded-pill" [(ngModel)]="currentProd.stock">
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
             <div class="col-12">
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
  productService = inject(ProductService);
  products: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];
  
  showForm = false;
  editingId: string | null = null;
  selectedFile: File | null = null;

  currentProd: any = {
    title: '',
    price: 0,
    desc: '',
    stock: 0,
    gender: 'unisex',
    season: '',
    category: '',
    subCategory: ''
  };

  ngOnInit() {
    this.load();
    this.productService.getCategories().subscribe(res => this.categories = res.data.categories);
    this.productService.getSubCategories().subscribe(res => this.subCategories = res.data.subCategories);
  }

  get filteredSubCategories() {
    return this.subCategories.filter(s => s.category?._id === this.currentProd.category || s.category === this.currentProd.category);
  }

  load() {
    this.productService.getProducts().subscribe(res => this.products = res.data.products);
  }

  openForm() {
    this.editingId = null;
    this.selectedFile = null;
    this.currentProd = {
      title: '', price: 0, desc: '', stock: 0,
      gender: 'unisex', season: '', category: this.categories[0]?._id || '',
      subCategory: ''
    };
    this.showForm = true;
  }

  editProduct(prod: any) {
    this.editingId = prod._id;
    this.selectedFile = null;
    this.currentProd = {
      title: prod.title,
      price: prod.price,
      desc: prod.desc,
      stock: prod.stock,
      gender: prod.gender,
      season: prod.season,
      category: prod.category?._id || prod.category,
      subCategory: prod.subCategory?._id || prod.subCategory
    };
    this.showForm = true;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveProduct() {
    const formData = new FormData();
    Object.keys(this.currentProd).forEach(key => {
      formData.append(key, this.currentProd[key]);
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
}
