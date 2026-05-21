import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/service/product-service';
import { FormsModule } from '@angular/forms';
import { Category } from '../../../models/interfaces';

@Component({
  selector: 'app-category-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h3 class="fw-bold mb-0">Manage Categories</h3>
      <button class="btn btn-primary rounded-pill px-4" (click)="openForm()">
        <i class="fas fa-plus me-2"></i>Add Category
      </button>
    </div>

    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let cat of categories">
            <td>{{cat.title}}</td>
            <td>
              <span class="badge rounded-pill" [class.bg-success]="cat.isActive" [class.bg-secondary]="!cat.isActive">
                {{cat.isActive ? 'Active' : 'Inactive'}}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-light rounded-circle me-2" (click)="editCategory(cat)"><i class="fas fa-edit"></i></button>
              <button class="btn btn-sm btn-light text-danger rounded-circle" (click)="deleteCategory(cat._id)"><i class="fas fa-trash-alt"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <div class="modal fade show d-block" *ngIf="showForm" style="background: rgba(0,0,0,0.5)">
       <div class="modal-dialog modal-dialog-centered">
         <div class="modal-content rounded-5 border-0 p-4">
           <h4 class="fw-bold mb-4">{{editingId ? 'Edit' : 'Add'}} Category</h4>
           <div class="mb-3">
             <label class="small fw-bold">Category Title</label>
             <input type="text" class="form-control rounded-pill" [(ngModel)]="currentCat.title">
           </div>
           <div class="form-check mb-4">
             <input class="form-check-input" type="checkbox" [(ngModel)]="currentCat.isActive" id="catActive">
             <label class="form-check-label" for="catActive">Active</label>
           </div>
           <div class="d-flex gap-2">
             <button class="btn btn-primary rounded-pill px-4" (click)="saveCategory()">Save</button>
             <button class="btn btn-light rounded-pill px-4" (click)="showForm = false">Cancel</button>
           </div>
         </div>
       </div>
    </div>
  `
})
export class CategoryManagementComponent implements OnInit {
  private productService = inject(ProductService);
  categories: Category[] = [];
  showForm = false;
  editingId: string | null = null;
  currentCat: Partial<Category> = { title: '', isActive: true };

  ngOnInit() {
    this.load();
  }

  load() {
    this.productService.getCategories().subscribe(res => this.categories = res.data.categories);
  }

  openForm() {
    this.editingId = null;
    this.currentCat = { title: '', isActive: true };
    this.showForm = true;
  }

  editCategory(cat: Category) {
    this.editingId = cat._id;
    this.currentCat = { ...cat };
    this.showForm = true;
  }

  saveCategory() {
    if (this.editingId) {
      this.productService.updateCategory(this.editingId, this.currentCat).subscribe(() => {
        this.load();
        this.showForm = false;
      });
    } else {
      this.productService.createCategory(this.currentCat).subscribe(() => {
        this.load();
        this.showForm = false;
      });
    }
  }

  deleteCategory(id: string) {
    if (confirm('Delete category?')) {
      this.productService.deleteCategory(id).subscribe(() => this.load());
    }
  }
}
