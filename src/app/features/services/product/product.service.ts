import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = 'http://127.0.0.1:8000/api';

  list() {
    return this.http.get<Product[]>(`${this.base}/products`);
  }
}
