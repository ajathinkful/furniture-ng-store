import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../features/services/product/product.service';
import { CartService } from '../../features/services/cart/cart.service';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './products.component.html',
})
export class ProductsComponent {
  products$!: Observable<Product[]>;

  constructor(private products: ProductService, private cart: CartService) {
    this.products$ = this.products.list(); // async pipe in template
  }

  add(p: Product) {
    this.cart.add(p, 1);
    alert(`Added "${p.name}" to cart`);
  }
}
