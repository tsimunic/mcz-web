/**
 * Modeli web shopa.
 * Kad spojite pravi backend (npr. WooCommerce REST API, vlastiti API ili headless CMS),
 * mapirajte odgovor na ova sučelja i ostatak aplikacije radi bez izmjena.
 */

export type Availability = 'in-stock' | 'on-request' | 'out-of-stock';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  /** Jedinstveni ID – ujedno i slug u URL-u (/proizvod/:slug) */
  id: string;
  slug: string;
  name: string;
  brand?: string;
  /** Slugovi kategorija (listovi stabla). Roditeljske kategorije računaju se automatski. */
  categories: string[];
  /** Cijena u EUR */
  price: number;
  oldPrice?: number;
  /** Prva slika je glavna; druga se prikazuje na hover u kartici */
  images: string[];
  availability: Availability;
  sku?: string;
  badge?: string;
  /** Prikaz u sekciji "Izdvojeno iz ponude" na naslovnici */
  featured?: boolean;
  description?: string;
  specs?: ProductSpec[];
}

export interface Category {
  slug: string;
  name: string;
  parent?: string;
  description?: string;
}

export interface CategoryNode extends Category {
  count: number;
  children: CategoryNode[];
}

export interface CartLine {
  productId: string;
  qty: number;
}

export interface ShippingMethod {
  id: string;
  label: string;
  description: string;
  /** null = cijena po dogovoru */
  price: number | null;
  requiresAddress: boolean;
}

export interface PaymentMethod {
  id: string;
  label: string;
  description: string;
  /** Ako je postavljeno, metoda je dostupna samo uz te načine dostave */
  onlyFor?: string[];
  disabled?: boolean;
}

export interface OrderCustomer {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  zip: string;
  city: string;
  country: string;
  note: string;
}

export interface Order {
  number: string;
  createdAt: string;
  customer: OrderCustomer;
  shipping: ShippingMethod;
  payment: PaymentMethod;
  lines: { productId: string; name: string; price: number; qty: number; image?: string }[];
  subtotal: number;
  total: number;
}
