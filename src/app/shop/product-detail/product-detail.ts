import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/data/site';
import { EurPipe } from '../../core/pipes/eur.pipe';
import { CartService } from '../../core/services/cart.service';
import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { ToastService } from '../../core/services/toast.service';
import { fullSize } from '../../core/utils/plural';
import { Icon } from '../../shared/icon/icon';
import { AVAILABILITY_LABEL, ProductCard } from '../../shared/product-card/product-card';

@Component({
  selector: 'app-product-detail',
  imports: [RouterLink, EurPipe, Icon, ProductCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  readonly slug = input.required<string>();

  private readonly shop = inject(ProductService);
  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  private readonly seo = inject(SeoService);

  protected readonly site = SITE;
  protected readonly labels = AVAILABILITY_LABEL;

  protected readonly product = computed(() => this.shop.bySlug(this.slug()));
  protected readonly path = computed(() => {
    const p = this.product();
    return p ? this.shop.categoryPath(p.categories[0]) : [];
  });
  protected readonly related = computed(() => {
    const p = this.product();
    return p ? this.shop.related(p, 4) : [];
  });

  /** Resetiraju se pri promjeni proizvoda */
  protected readonly activeImage = linkedSignal({ source: this.slug, computation: () => 0 });
  protected readonly qty = linkedSignal({ source: this.slug, computation: () => 1 });
  protected readonly tab = linkedSignal<string, 'opis' | 'spec'>({
    source: this.slug,
    computation: () => (this.product()?.description ? 'opis' : 'spec'),
  });

  protected readonly mainImage = computed(() => {
    const p = this.product();
    const src = p?.images[this.activeImage()];
    return src ? { full: fullSize(src), thumb: src } : null;
  });

  protected readonly inCart = computed(() => {
    const p = this.product();
    return p ? this.cart.qtyOf(p.id) : 0;
  });

  constructor() {
    // Oznake za Google i pregled linka (WhatsApp, Facebook…): fotografija, naziv, cijena i opis proizvoda
    effect(() => {
      const p = this.product();
      if (!p) {
        this.seo.set({ title: 'Proizvod nije pronađen', path: '/proizvod/' + this.slug(), noindex: true });
        return;
      }
      const price = new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' }).format(p.price);
      const lead = `${price} · ${AVAILABILITY_LABEL[p.availability]}.`;
      this.seo.set({
        title: p.name,
        description: p.description ? `${lead} ${p.description}` : `${lead} ${p.brand} u ponudi Moto Centra Zagorje, Bedekovčina.`,
        path: '/proizvod/' + p.slug,
        image: p.images[0] ? fullSize(p.images[0]) : undefined,
        imageAlt: p.name,
        type: 'product',
        price: p.price,
      });
    });
  }

  protected step(delta: number): void {
    this.qty.update((q) => Math.max(1, Math.min(99, q + delta)));
  }

  protected setQty(value: string): void {
    const n = Math.floor(Number(value));
    this.qty.set(Number.isFinite(n) && n > 0 ? Math.min(99, n) : 1);
  }

  protected addToCart(): void {
    const p = this.product();
    if (!p) return;
    this.cart.add(p, this.qty());
    this.toast.show({
      title: 'Dodano u košaricu',
      text: `${this.qty()} × ${p.name}`,
      image: p.images[0],
      action: { label: 'Otvori košaricu', link: '/kosarica' },
    });
  }

  /** Ako originalna veličina slike ne postoji, vrati sličicu */
  protected fallback(event: Event, thumb: string): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== thumb) img.src = thumb;
  }
}
