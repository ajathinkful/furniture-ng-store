import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html'
})
export class OrderConfirmationComponent {
  orderId = '';
  total: number | null = null;
  customerName = '';
  email = '';
  items: Array<{ name: string; unitPrice: number; quantity: number; subtotal: number }> = [];

  constructor(private route: ActivatedRoute) {
    // ✅ Now it's safe to use `this.route`
    this.orderId = this.route.snapshot.paramMap.get('id') ?? '';

    const state = history.state ?? {};

    this.total = state.total ?? null;
    this.customerName = state.customerName ?? '';
    this.email = state.email ?? '';
    this.items = state.items ?? [];
  }
}
