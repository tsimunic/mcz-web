import { Injectable, inject } from '@angular/core';
import { Order, OrderCustomer, PaymentMethod, ShippingMethod } from '../models/product.model';
import { CartService } from './cart.service';

const LAST_ORDER_KEY = 'mcz.lastOrder';

/**
 * Narudžbe – TRENUTNO SIMULACIJA.
 * Ništa se ne šalje na server. Spojite `placeOrder` na svoj backend
 * (npr. HttpClient POST /api/orders ili WooCommerce Orders API).
 */
@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly cart = inject(CartService);

  async placeOrder(customer: OrderCustomer, shipping: ShippingMethod, payment: PaymentMethod): Promise<Order> {
    const items = this.cart.items();
    const subtotal = this.cart.subtotal();
    const order: Order = {
      number: createOrderNumber(),
      createdAt: new Date().toISOString(),
      customer,
      shipping,
      payment,
      lines: items.map((i) => ({
        productId: i.product.id,
        name: i.product.name,
        price: i.product.price,
        qty: i.qty,
        image: i.product.images[0],
      })),
      subtotal,
      total: subtotal + (shipping.price ?? 0),
    };

    // TODO: zamijeniti stvarnim pozivom na API
    await new Promise((r) => setTimeout(r, 700));

    try {
      sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
    } catch {
      /* ignore */
    }
    this.cart.clear();
    return order;
  }

  lastOrder(number: string): Order | null {
    try {
      const raw = sessionStorage.getItem(LAST_ORDER_KEY);
      const order = raw ? (JSON.parse(raw) as Order) : null;
      return order?.number === number ? order : null;
    } catch {
      return null;
    }
  }
}

function createOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `MCZ-${ymd}-${rand}`;
}
