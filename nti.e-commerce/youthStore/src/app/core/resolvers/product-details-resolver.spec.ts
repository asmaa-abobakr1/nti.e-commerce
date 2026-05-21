import { TestBed } from '@angular/core/core';
import { ResolveFn } from '@angular/router';
import { productDetailsResolver } from './product-details-resolver';
import { ApiResponse } from '../models/auth.model';
import { Product } from '../models/product.model';

describe('productDetailsResolver', () => {
  const executeResolver: ResolveFn<ApiResponse<{ product: Product }>> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => productDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
