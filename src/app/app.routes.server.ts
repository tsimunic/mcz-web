import { RenderMode, ServerRoute } from '@angular/ssr';
import { CATEGORIES } from './core/data/categories.data';
import { PRODUCTS } from './core/data/products.data';

/**
 * Koje se stranice pri `ng build` unaprijed generiraju u HTML.
 *
 * Zašto: WhatsApp, Facebook, Viber i Google pri dijeljenju linka čitaju samo HTML i ne pokreću
 * JavaScript. Generirana stranica proizvoda već sadrži njegovu fotografiju, naziv, cijenu i opis,
 * pa pregled linka izgleda kao na staroj stranici (ili bolje). Rezultat su obične datoteke –
 * hosting ne treba Node poslužitelj.
 *
 * Kad proizvodi dođu s API-ja, u getPrerenderParams dohvatite popis slugova s API-ja.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: 'trgovina/:kategorija',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => CATEGORIES.map((c) => ({ kategorija: c.slug })),
  },
  {
    path: 'proizvod/:slug',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => PRODUCTS.map((p) => ({ slug: p.slug })),
  },
  // Sadržaj ovisi o kupcu (košarica u pregledniku) – generira se tek u pregledniku
  { path: 'kosarica', renderMode: RenderMode.Client },
  { path: 'blagajna', renderMode: RenderMode.Client },
  { path: 'narudzba/:broj', renderMode: RenderMode.Client },
  // Naslovnica, trgovina, servis, kontakt, pravne stranice
  { path: '**', renderMode: RenderMode.Prerender },
];
