
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
  rating: number;
  availabilityStatus?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductPayload {
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  stock: number;
  brand: string;
  thumbnail: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://dummyjson.com/products';

  getProducts(): Observable<Product[]> {
    return this.http
      .get<ProductsResponse>(`${this.apiUrl}?limit=0`)
      .pipe(map(response => response.products));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(payload: ProductPayload): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/add`, payload);
  }

  updateProduct(
    id: number,
    payload: Partial<ProductPayload>
  ): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, payload);
  }

  deleteProduct(id: number): Observable<Product> {
    return this.http.delete<Product>(`${this.apiUrl}/${id}`);
  }
}

