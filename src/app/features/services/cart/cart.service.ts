import { Injectable, signal, computed } from '@angular/core';
import type { Product } from '../product/product.service';

export type CartItem = {
  product: Product;
  quantity: number;
};

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>([]);

  count = computed(() => this.items().reduce((n, it) => n + it.quantity, 0));
  total = computed(() => this.items().reduce((sum, it) => sum + it.product.price * it.quantity, 0));

  add(product: Product, qty = 1) {
    console.log('add:', product.id, 'qty:', qty);

    const next = [...this.items()];
    const idx = next.findIndex(i => i.product.id === product.id);

    if (idx >= 0) {
      next[idx] = { ...next[idx], quantity: next[idx].quantity + qty };
      console.log('updated quantity →', next[idx].quantity);
    } else {
      next.push({ product, quantity: qty });
      console.log('added new item');
    }

    this.items.set(next);
    console.log('items:', this.items());
  }

  remove(productId: string) {
    console.log('remove:', productId);
    this.items.set(this.items().filter(i => i.product.id !== productId));
    console.log('items:', this.items());
  }

  updateQty(productId: string, qty: number) {
    console.log('update qty:', productId, '→', qty);

    if (qty <= 0) {
      console.log('qty is 0 → removing');
      return this.remove(productId);
    }

    this.items.set(
      this.items().map(i =>
        i.product.id === productId ? { ...i, quantity: qty } : i
      )
    );

    console.log('items:', this.items());
  }

  clear() {
    console.log('clear cart');
    this.items.set([]);
    console.log('items:', this.items());
  }
}
