import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, signal } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Params, Router, RouterLink } from '@angular/router';
import { PAGE_SIZE } from '../../core/data/shop-config';
import { CategoryNode, Product } from '../../core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { SeoService } from '../../core/services/seo.service';
import { PRODUCT_FORMS, plural } from '../../core/utils/plural';
import { Icon } from '../../shared/icon/icon';
import { Crumb, PageHero } from '../../shared/page-hero/page-hero';
import { ProductCard } from '../../shared/product-card/product-card';

type SortKey = 'preporuceno' | 'cijena-uzlazno' | 'cijena-silazno' | 'naziv';

const SORTS: { key: SortKey; label: string }[] = [
  { key: 'preporuceno', label: 'Preporučeno' },
  { key: 'cijena-uzlazno', label: 'Cijena: od najniže' },
  { key: 'cijena-silazno', label: 'Cijena: od najviše' },
  { key: 'naziv', label: 'Naziv: A–Ž' },
];

/**
 * Popis proizvoda: /trgovina i /trgovina/:kategorija
 * Svi filteri žive u URL-u (?q=&sort=&min=&max=&zaliha=1&stranica=2) pa se linkovi mogu dijeliti.
 */
@Component({
  selector: 'app-shop-list',
  imports: [RouterLink, NgTemplateOutlet, PageHero, ProductCard, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shop-list.html',
  styleUrl: './shop-list.scss',
})
export class ShopList {
  // ---- Ulazi iz rute (withComponentInputBinding) ----
  readonly kategorija = input<string>();
  readonly q = input<string>();
  readonly sort = input<string>();
  readonly min = input<string>();
  readonly max = input<string>();
  readonly zaliha = input<string>();
  readonly stranica = input<string>();

  private readonly shop = inject(ProductService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  protected readonly sorts = SORTS;
  protected readonly tree = this.shop.tree;
  protected readonly totalCount = computed(() => this.shop.products().length);

  protected readonly category = computed(() => {
    const slug = this.kategorija();
    return slug ? this.shop.category(slug) : undefined;
  });
  protected readonly unknownCategory = computed(() => !!this.kategorija() && !this.category());
  protected readonly path = computed(() => (this.category() ? this.shop.categoryPath(this.category()!.slug) : []));

  protected readonly crumbs = computed<Crumb[]>(() => {
    const base: Crumb[] = [{ label: 'Trgovina', link: '/trgovina' }];
    return [...base, ...this.path().map((c) => ({ label: c.name, link: ['/trgovina', c.slug] }))];
  });

  protected readonly heading = computed(() => this.category()?.name ?? 'Trgovina');
  protected readonly lead = computed(
    () => this.category()?.description ?? 'Vozila, rezervni dijelovi, servis kitovi i dodatna oprema na jednom mjestu.',
  );

  private readonly base = computed<Product[]>(() => {
    const slug = this.kategorija();
    return slug ? this.shop.inCategory(slug) : this.shop.products();
  });

  protected readonly sortKey = computed<SortKey>(() => {
    const s = this.sort() as SortKey;
    return SORTS.some((x) => x.key === s) ? s : 'preporuceno';
  });
  protected readonly minPrice = computed(() => toNumber(this.min()));
  protected readonly maxPrice = computed(() => toNumber(this.max()));
  protected readonly inStockOnly = computed(() => this.zaliha() === '1');
  protected readonly query = computed(() => (this.q() ?? '').trim());

  protected readonly filtered = computed(() => {
    let list = this.shop.search(this.query(), this.base());
    const min = this.minPrice();
    const max = this.maxPrice();
    if (min != null) list = list.filter((p) => p.price >= min);
    if (max != null) list = list.filter((p) => p.price <= max);
    if (this.inStockOnly()) list = list.filter((p) => p.availability === 'in-stock');

    const sorted = [...list];
    switch (this.sortKey()) {
      case 'cijena-uzlazno':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'cijena-silazno':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'naziv':
        sorted.sort((a, b) => a.name.localeCompare(b.name, 'hr'));
        break;
    }
    return sorted;
  });

  protected readonly resultLabel = computed(() => {
    const n = this.filtered().length;
    return `${n} ${plural(n, PRODUCT_FORMS)}`;
  });

  protected readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filtered().length / PAGE_SIZE)));
  protected readonly page = computed(() => {
    const p = Math.floor(toNumber(this.stranica()) ?? 1);
    return Math.min(Math.max(1, p), this.totalPages());
  });
  protected readonly paged = computed(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.filtered().slice(start, start + PAGE_SIZE);
  });
  protected readonly pages = computed(() => Array.from({ length: this.totalPages() }, (_, i) => i + 1));

  protected readonly activeFilters = computed(() => {
    const chips: { label: string; clear: Params }[] = [];
    if (this.query()) chips.push({ label: `Pretraga: „${this.query()}”`, clear: { q: null } });
    if (this.minPrice() != null || this.maxPrice() != null) {
      chips.push({
        label: `Cijena: ${this.minPrice() ?? 0} – ${this.maxPrice() ?? '∞'} €`,
        clear: { min: null, max: null },
      });
    }
    if (this.inStockOnly()) chips.push({ label: 'Samo na zalihi', clear: { zaliha: null } });
    return chips;
  });

  /** Otvorene grane stabla kategorija – početno otvorena grana aktivne kategorije */
  protected readonly expanded = linkedSignal<Set<string>>(() => new Set(this.path().map((c) => c.slug)));
  protected readonly filtersOpen = signal(false);

  constructor() {
    // Naslov i opis za Google i pregled linka; filteri u adresi (?cijena=…) ne mijenjaju kanonsku adresu
    effect(() => {
      const slug = this.kategorija();
      const c = this.category();
      if (slug && !c) {
        this.seo.set({ title: 'Kategorija nije pronađena', path: '/trgovina/' + slug, noindex: true });
      } else if (c) {
        this.seo.set({
          title: c.name,
          description: c.description ?? `${c.name} u ponudi Moto Centra Zagorje: cijene, dostupnost i upit za svaki model.`,
          path: '/trgovina/' + c.slug,
        });
      } else {
        this.seo.set({
          title: 'Trgovina',
          description: 'Trgovina Moto Centra Zagorje: ATV i UTV vozila, motocikli, rezervni dijelovi, servis kitovi i dodatna oprema.',
          path: '/trgovina',
        });
      }
    });
  }

  protected isExpanded(node: CategoryNode): boolean {
    return this.expanded().has(node.slug);
  }

  protected toggle(node: CategoryNode): void {
    this.expanded.update((set) => {
      const next = new Set(set);
      if (next.has(node.slug)) next.delete(node.slug);
      else next.add(node.slug);
      return next;
    });
  }

  protected update(params: Params, resetPage = true): void {
    this.router.navigate([], {
      queryParams: { ...params, ...(resetPage ? { stranica: null } : {}) },
      queryParamsHandling: 'merge',
    });
  }

  protected onSearch(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    this.update({ q: input.value.trim() || null });
  }

  protected onPrice(event: Event, minEl: HTMLInputElement, maxEl: HTMLInputElement): void {
    event.preventDefault();
    this.update({ min: minEl.value || null, max: maxEl.value || null });
    this.filtersOpen.set(false);
  }

  protected clearAll(): void {
    this.router.navigate([], { queryParams: {} });
  }
}

function toNumber(value: string | undefined): number | undefined {
  if (value == null || value === '') return undefined;
  const n = Number(value.replace(',', '.'));
  return Number.isFinite(n) ? n : undefined;
}
