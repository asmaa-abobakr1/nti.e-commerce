import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/service/product-service';
import { FormsModule } from '@angular/forms';
import { Category, SubCategory } from '../../../models/interfaces';

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
            <td>{{ getCategoryTitle(sub.category) }}</td>
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
             <label class="small fw-bold d-block mb-2">Parent Categories</label>
             <div class="d-flex flex-column gap-2 p-3 border rounded-4 bg-light" style="max-height: 200px; overflow-y: auto;">
               <div class="form-check" *ngFor="let cat of categories">
                 <input 
                   class="form-check-input" 
                   type="checkbox" 
                   [id]="'cat_' + cat._id" 
                   [checked]="isCategorySelected(cat._id)"
                   (change)="toggleCategory(cat._id)"
                 >
                 <label class="form-check-label small fw-semibold" [for]="'cat_' + cat._id">
                   {{cat.title}}
                 </label>
               </div>
             </div>
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
  private productService = inject(ProductService);
  subCategories: SubCategory[] = [];
  categories: Category[] = [];
  showForm = false;
  editingId: string | null = null;
  currentSub: { title: string, category: string[] } = { title: '', category: [] };

  ngOnInit() {
    this.load();
    this.productService.getCategories().subscribe(res => this.categories = res.data.categories);
  }

  getCategoryTitle(cat: string[] | Category[] | any): string {
    if (!cat) return 'None';
    if (Array.isArray(cat)) {
      return cat.map(c => {
        if (typeof c === 'string') {
          return this.categories.find(item => item._id === c)?.title || 'Unknown';
        }
        return c?.title || 'Unknown';
      }).join(', ');
    }
    if (typeof cat === 'string') {
      return this.categories.find(c => c._id === cat)?.title || 'Unknown';
    }
    return cat?.title || 'Unknown';
  }

  isCategorySelected(id: string): boolean {
    return this.currentSub.category.includes(id);
  }

  toggleCategory(id: string) {
    const index = this.currentSub.category.indexOf(id);
    if (index > -1) {
      this.currentSub.category.splice(index, 1);
    } else {
      this.currentSub.category.push(id);
    }
  }

  load() {
    this.productService.getSubCategories().subscribe(res => {
       this.subCategories = (res.data as any).subcategories || (res.data as any).subCategories;
    });
  }

  openForm() {
    this.editingId = null;
    this.currentSub = { title: '', category: [] };
    this.showForm = true;
  }

  editSub(sub: SubCategory) {
    this.editingId = sub._id;
    let selectedCats: string[] = [];
    if (Array.isArray(sub.category)) {
      selectedCats = sub.category.map(c => typeof c === 'string' ? c : c?._id || '');
    } else if (sub.category) {
      selectedCats = [typeof sub.category === 'string' ? sub.category : (sub.category as any)?._id || ''];
    }
    this.currentSub = { 
      title: sub.title, 
      category: selectedCats.filter(id => id !== '')
    };
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
