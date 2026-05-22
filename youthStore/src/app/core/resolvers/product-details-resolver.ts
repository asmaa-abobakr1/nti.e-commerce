import { inject } from '@angular/core';
import { ResolveFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ProductService } from '../service/product-service';
import { Product } from '../models/product.model';
import { ApiResponse } from '../models/auth.model';

export const productDetailsResolver: ResolveFn<ApiResponse<{ product: Product }>> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const productService = inject(ProductService);
  const id = route.paramMap.get('id');
  return productService.getProductById(id || '');
};
