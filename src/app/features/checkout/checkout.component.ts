import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../features/services/cart/cart.service';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  form!: FormGroup;
  submitting = signal(false);
  orderId = signal<string | null>(null);

  private base = 'http://127.0.0.1:8000/api';

  constructor(
    public cart: CartService,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router, 
  ) {
    this.form = this.fb.nonNullable.group({
      customerName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

   submit() {
    if (this.form.invalid || this.cart.items().length === 0) return;

    this.submitting.set(true);

    const { customerName, email } = this.form.getRawValue();
    const lineItems = this.cart.items().map(i => ({ // Save a snapshot for the receipt
      productId: i.product.id,
      name: i.product.name,
      unitPrice: i.product.price,
      quantity: i.quantity,
      subtotal: i.product.price * i.quantity,
    }));

    const payload = {
      items: lineItems.map(i => ({ productId: i.productId, quantity: i.quantity })), // API expects id + qty
      customerName,
      email,
    };

    this.http.post<{ orderId: string; total: number }>('http://127.0.0.1:8000/api/checkout', payload)
      .subscribe({
        next: (res) => {
          this.cart.clear();
          this.submitting.set(false);
          // Navigate to confirmation with state we want to show
          this.router.navigate(['/order', res.orderId], {
            state: {
              total: res.total,
              customerName,
              email,
              items: lineItems,
            }
          });
        },
        error: () => this.submitting.set(false),
      });
  }
}
