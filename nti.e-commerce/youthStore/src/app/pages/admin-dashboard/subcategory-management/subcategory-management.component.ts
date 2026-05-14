import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-subcategory-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">Manage SubCategories</h3>
      <button class="btn btn-primary rounded-pill px-4" (click)="openForm()">
        <i class="fas fa-plus me-2"></i>Add SubCategory
      </button>
    </div>

    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Title</th>
            <th>Parent Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let sub of subCategories">
            <td>{{sub.title}}</td>
            <td>{{sub.category?.title}}</td>
            <td>
              <button class="btn btn-sm btn-light rounded-circle me-2" (click)="editSub(sub)"><i class="fas fa-edit"></i></button>
              <button class="btn btn-sm btn-light text-danger rounded-circle" (click)="deleteSub(sub._id)"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <div class="modal fade show d-block" *ngIf="showForm" style="background: rgba(0,0,0,0.5)">
       <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content rounded-5 border-0 p-4">
           <h4 class="fw-bold mb-4">{{editingId ? 'Edit' : 'Add'}} SubCategory</h4>
           <div class="mb-3">
             <label class="small fw-bold">Title</label>
             <input type="text" class="form-control rounded-pill" [(ngModel)]="currentSub.title">
           </div>
           <div class="mb-4">
             <label class="small fw-bold">Parent Category</label>
             <select class="form-select rounded-pill" [(ngModel)]="currentSub.category">
               <option *ngFor="let cat of categories" [value]="cat._id">{{cat.title}}</option>
             </select>
           </div>
           <div class="d-flex gap-2">
             <button class="btn btn-primary rounded-pill px-4" (click)="saveSub()">Save</button>
             <button class="btn btn-light rounded-pill px-4" (click)="showForm = false">Cancel</button>
           </div>
         </div>
       </div>
    </div>
  `
})
export class SubCategoryManagementComponent implements OnInit {
  productService = inject(ProductService);
  subCategories: any[] = [];
  categories: any[] = [];
  showForm = false;
  editingId: string | null = null;
  currentSub: any = { title: '', category: '' };

  ngOnInit() {
    this.load();
    this.productService.getCategories().subscribe(res => this.categories = res.data.categories);
  }

  load() {
    this.productService.getSubCategories().subscribe(res => this.subCategories = res.data.subCategories);
  }

  openForm() {
    this.editingId = null;
    this.currentSub = { title: '', category: this.categories[0]?._id || '' };
    this.showForm = true;
  }

  editSub(sub: any) {
    this.editingId = sub._id;
    this.currentSub = { title: sub.title, category: sub.category?._id || sub.category };
    this.showForm = true;
  }

  saveSub() {
    if (this.editingId) {
      this.productService.updateSubCategory(this.editingId, this.currentSub).subscribe(() => {
        this.load();
        this.showForm = false;
      });
    } else {
      this.productService.createSubCategory(this.currentSub).subscribe(() => {
        this.load();
        this.showForm = false;
      });
    }
  }

  deleteSub(id: string) {
    if (confirm('Delete subcategory?')) {
      this.productService.deleteSubCategory(id).subscribe(() => this.load());
    }
  }
}
