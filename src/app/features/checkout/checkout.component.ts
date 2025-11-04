import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../features/services/cart/cart.service';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterLink, Router } from '@angular/router';

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
    console.log("🟢 Checkout submitted");

    if (this.form.invalid) {
      console.warn("⚠️ Form is invalid:", this.form.value);
      return;
    }
    if (this.cart.items().length === 0) {
      console.warn("⚠️ Cart is empty.");
      return;
    }

    this.submitting.set(true);

    const { customerName, email } = this.form.getRawValue();

    const lineItems = this.cart.items().map(i => ({
      productId: i.product.id,
      name: i.product.name,
      unitPrice: i.product.price,
      quantity: i.quantity,
      subtotal: i.product.price * i.quantity,
    }));

    console.log("🛒 Line items being sent with receipt:", lineItems);

    const payload = {
      items: lineItems.map(i => ({ productId: i.productId, quantity: i.quantity })),
      customerName,
      email,
    };

    console.log("📦 Payload prepared for API:", payload);

    this.http.post<{ orderId: string; total: number }>(`${this.base}/checkout`, payload)
      .subscribe({
        next: (res) => {
          console.log("✅ Checkout success:", res);

          this.cart.clear();
          this.submitting.set(false);

          console.log("➡️ Navigating to order confirmation page with state:", {
            total: res.total,
            customerName,
            email,
            items: lineItems,
          });

          this.router.navigate(['/order', res.orderId], {
            state: {
              total: res.total,
              customerName,
              email,
              items: lineItems,
            }
          });
        },
        error: (err) => {
          console.error("❌ Checkout failed:", err);
          this.submitting.set(false);
        },
      });
  }
}
