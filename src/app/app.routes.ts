import { Routes } from '@angular/router';
import { ProductsComponent } from './features/products/products.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { OrderConfirmationComponent } from './features/order-confirmation/order-confirmation.component';


export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent, title: 'Products' },
  { path: 'checkout', component: CheckoutComponent, title: 'Checkout' },
  { path: 'order/:id', component: OrderConfirmationComponent, title: 'Order Confirmation' },
  { path: '**', redirectTo: 'products' },
];
