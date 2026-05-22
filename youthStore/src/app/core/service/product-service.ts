import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, Category, SubCategory } from '../models/product.model';
import { ApiResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;
  private catUrl = `${environment.apiUrl}/categories`;
  private subCatUrl = `${environment.apiUrl}/subcategories`;

  getProducts(filters: Record<string, string | number | boolean> = {}): Observable<ApiResponse<{ products: Product[] }>> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      const val = filters[key];
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val.toString());
      }
    });
    return this.http.get<ApiResponse<{ products: Product[] }>>(this.apiUrl, { params });
  }

  getProductById(id: string): Observable<ApiResponse<{ product: Product }>> {
    return this.http.get<ApiResponse<{ product: Product }>>(`${this.apiUrl}/${id}`);
  }

  getProduct(id: string): Observable<ApiResponse<{ product: Product }>> {
    return this.getProductById(id);
  }

  getCategories(): Observable<ApiResponse<{ categories: Category[] }>> {
    return this.http.get<ApiResponse<{ categories: Category[] }>>(this.catUrl);
  }

  getSubCategories(): Observable<ApiResponse<{ subcategories: SubCategory[] }>> {
    return this.http.get<ApiResponse<{ subcategories: SubCategory[] }>>(this.subCatUrl);
  }

  
  createCategory(data: Partial<Category>): Observable<ApiResponse<{ category: Category }>> {
    return this.http.post<ApiResponse<{ category: Category }>>(this.catUrl, data);
  }
  updateCategory(id: string, data: Partial<Category>): Observable<ApiResponse<{ category: Category }>> {
    return this.http.patch<ApiResponse<{ category: Category }>>(`${this.catUrl}/${id}`, data);
  }
  deleteCategory(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.catUrl}/${id}`);
  }

  
  createSubCategory(data: Partial<SubCategory>): Observable<ApiResponse<{ subcategory: SubCategory }>> {
    return this.http.post<ApiResponse<{ subcategory: SubCategory }>>(this.subCatUrl, data);
  }
  updateSubCategory(id: string, data: Partial<SubCategory>): Observable<ApiResponse<{ subcategory: SubCategory }>> {
    return this.http.patch<ApiResponse<{ subcategory: SubCategory }>>(`${this.subCatUrl}/${id}`, data);
  }
  deleteSubCategory(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.subCatUrl}/${id}`);
  }

  
  createProduct(productData: FormData): Observable<ApiResponse<{ product: Product }>> {
    return this.http.post<ApiResponse<{ product: Product }>>(this.apiUrl, productData);
  }

  updateProduct(id: string, productData: FormData): Observable<ApiResponse<{ product: Product }>> {
    return this.http.patch<ApiResponse<{ product: Product }>>(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
