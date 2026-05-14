import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/v1/products';
  private catUrl = 'http://localhost:5000/api/v1/categories';
  private subCatUrl = 'http://localhost:5000/api/v1/subcategories';

  getProducts(filters: any = {}): Observable<any> {
    let params = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });
    return this.http.get(this.apiUrl, { params });
  }

  getProduct(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<any> {
    return this.http.get(this.catUrl);
  }

  getSubCategories(): Observable<any> {
    return this.http.get(this.subCatUrl);
  }

  // Admin methods - Categories
  createCategory(data: any): Observable<any> {
    return this.http.post(this.catUrl, data);
  }
  updateCategory(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.catUrl}/${id}`, data);
  }
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.catUrl}/${id}`);
  }

  // Admin methods - SubCategories
  createSubCategory(data: any): Observable<any> {
    return this.http.post(this.subCatUrl, data);
  }
  updateSubCategory(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.subCatUrl}/${id}`, data);
  }
  deleteSubCategory(id: string): Observable<any> {
    return this.http.delete(`${this.subCatUrl}/${id}`);
  }

  // Admin methods - Products
  createProduct(productData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, productData);
  }

  updateProduct(id: string, productData: FormData): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}`, productData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
