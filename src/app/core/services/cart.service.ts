import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CartLine, Product } from '../models/product.model';
import { ProductService } from './product.service';

const STORAGE_KEY = 'mcz.cart.v1';
const MAX_QTY = 99;

export interface CartItem extends CartLine {
  product: Product;
  lineTotal: number;
}

/** Košarica – čuva se u localStorageu preglednika. */
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly shop = inject(ProductService);
  /** Pri generiranju stranica (prerender) košarica je prazna – sadržaj je samo u pregledniku kupca */
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly _lines = signal<CartLine[]>(this.browser ? readStorage() : []);

  readonly items = computed<CartItem[]>(() =>
    this._lines()
      .map((l) => {
        const product = this.shop.byId(l.productId);
        return product ? { ...l, product, lineTotal: product.price * l.qty } : null;
      })
      .filter((i): i is CartItem => i !== null),
  );

  readonly count = computed(() => this.items().reduce((n, i) => n + i.qty, 0));
  readonly subtotal = computed(() => round(this.items().reduce((s, i) => s + i.lineTotal, 0)));
  readonly isEmpty = computed(() => this.items().length === 0);

  constructor() {
    effect(() => {
      const lines = this._lines();
      if (!this.browser) return;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
      } catch {
        /* privatni način rada ili blokirana pohrana – košarica radi samo u memoriji */
      }
    });
  }

  qtyOf(productId: string): number {
    return this._lines().find((l) => l.productId === productId)?.qty ?? 0;
  }

  add(product: Product, qty = 1): void {
    this._lines.update((lines) => {
      const existing = lines.find((l) => l.productId === product.id);
      if (existing) {
        return lines.map((l) => (l.productId === product.id ? { ...l, qty: clamp(l.qty + qty) } : l));
      }
      return [...lines, { productId: product.id, qty: clamp(qty) }];
    });
  }

  setQty(productId: string, qty: number): void {
    if (qty <= 0) return this.remove(productId);
    this._lines.update((lines) => lines.map((l) => (l.productId === productId ? { ...l, qty: clamp(qty) } : l)));
  }

  remove(productId: string): void {
    this._lines.update((lines) => lines.filter((l) => l.productId !== productId));
  }

  clear(): void {
    this._lines.set([]);
  }
}

function clamp(qty: number): number {
  return Math.max(1, Math.min(MAX_QTY, Math.floor(qty)));
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}

function readStorage(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine => typeof l?.productId === 'string' && typeof l?.qty === 'number' && l.qty > 0,
    );
  } catch {
    return [];
  }
}
