import { Injectable, computed, signal } from '@angular/core';
import { CATEGORIES } from '../data/categories.data';
import { PRODUCTS } from '../data/products.data';
import { Category, CategoryNode, Product } from '../models/product.model';

/**
 * Izvor podataka za trgovinu.
 *
 * Za spajanje na backend zamijenite `signal(PRODUCTS)` npr. s:
 *   private readonly res = httpResource<Product[]>(() => '/api/products');
 *   readonly products = computed(() => this.res.value() ?? []);
 * Sve ostale metode rade nad `products()` i ne treba ih mijenjati.
 */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _products = signal<Product[]>(PRODUCTS);
  private readonly _categories = signal<Category[]>(CATEGORIES);

  readonly products = this._products.asReadonly();
  readonly categories = this._categories.asReadonly();

  private readonly categoryMap = computed(() => new Map(this.categories().map((c) => [c.slug, c])));

  /** Za svaku kategoriju: skup slugova nje same i svih potomaka */
  private readonly descendants = computed(() => {
    const cats = this.categories();
    const map = new Map<string, Set<string>>();
    const collect = (slug: string): Set<string> => {
      const set = new Set<string>([slug]);
      for (const c of cats) if (c.parent === slug) collect(c.slug).forEach((s) => set.add(s));
      return set;
    };
    for (const c of cats) map.set(c.slug, collect(c.slug));
    return map;
  });

  readonly tree = computed<CategoryNode[]>(() => {
    const build = (parent?: string): CategoryNode[] =>
      this.categories()
        .filter((c) => c.parent === parent)
        .map((c) => ({ ...c, count: this.inCategory(c.slug).length, children: build(c.slug) }));
    return build(undefined);
  });

  readonly featured = computed(() => this.products().filter((p) => p.featured));

  bySlug(slug: string): Product | undefined {
    return this.products().find((p) => p.slug === slug);
  }

  byId(id: string): Product | undefined {
    return this.products().find((p) => p.id === id);
  }

  category(slug: string): Category | undefined {
    return this.categoryMap().get(slug);
  }

  /** Put od korijena do kategorije, npr. [Vozila, Linhai] */
  categoryPath(slug: string): Category[] {
    const path: Category[] = [];
    let current = this.category(slug);
    while (current) {
      path.unshift(current);
      current = current.parent ? this.category(current.parent) : undefined;
    }
    return path;
  }

  inCategory(slug: string): Product[] {
    const set = this.descendants().get(slug);
    if (!set) return [];
    return this.products().filter((p) => p.categories.some((c) => set.has(c)));
  }

  related(product: Product, limit = 4): Product[] {
    const primary = product.categories[0];
    const sameCat = this.inCategory(primary).filter((p) => p.id !== product.id);
    const sameBrand = this.products().filter((p) => p.brand === product.brand && p.id !== product.id);
    const merged = [...sameCat, ...sameBrand.filter((p) => !sameCat.includes(p))];
    return merged.slice(0, limit);
  }

  search(query: string, list: Product[] = this.products()): Product[] {
    const q = normalize(query);
    if (!q) return list;
    const terms = q.split(/\s+/);
    return list.filter((p) => {
      const hay = normalize(`${p.name} ${p.brand ?? ''} ${p.sku ?? ''}`);
      return terms.every((t) => hay.includes(t));
    });
  }
}

/** Mala slova, bez dijakritika – "kočione" pronalazi i "kocione" */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}
