import { Product } from '../models/product.model';

export interface DisplayName {
  /** Naziv bez brenda i tehničkih oznaka, npr. "ATV 550 L" */
  model: string;
  /** Kratke oznake za karticu, npr. ["4×4", "EPS", "T3b"] */
  tags: string[];
}

/** Redoslijed je i redoslijed prikaza na kartici. */
const TAGS: { re: RegExp; label: (m: RegExpMatchArray) => string }[] = [
  { re: /\b4\s*[×x]\s*([24])\b/i, label: (m) => `4×${m[1]}` },
  { re: /\bEPS\b/, label: () => 'EPS' },
  { re: /\bEFI\b/, label: () => 'EFI' },
  { re: /\bT([13])b\b/i, label: (m) => `T${m[1]}b` },
  { re: /\b(\d{2,4})\s*cm³/, label: (m) => `${m[1]} cm³` },
];

/**
 * Razdvaja dugi WooCommerce naziv na kratki model i oznake.
 * "Linhai ATV 550 L, EPS, 4×4, T3B" → { model: "ATV 550 L", tags: ["4×4", "EPS", "T3b"] }
 * Brend se skida samo ako ostatak počinje velikim slovom ili brojem ("Shark kofer AX97" ostaje cijeli).
 */
export function displayName(p: Product): DisplayName {
  let rest = p.name;
  const tags: string[] = [];

  for (const { re, label } of TAGS) {
    const m = rest.match(re);
    if (m) {
      tags.push(label(m));
      rest = rest.replace(re, ' ');
    }
  }

  rest = rest
    .replace(/\(\s*\)/g, ' ')
    .replace(/\s*,(\s*,)+/g, ',')
    .replace(/\s+,/g, ',')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s,]+|[\s,]+$/g, '');

  if (p.brand && rest.toLowerCase().startsWith(p.brand.toLowerCase() + ' ')) {
    const withoutBrand = rest.slice(p.brand.length + 1).trim();
    if (/^[A-ZČĆŠŽĐ0-9]/.test(withoutBrand)) rest = withoutBrand;
  }

  return { model: rest || p.name, tags };
}
