import { Routes } from '@angular/router';

/**
 * `title` se prikazuje kao "<title> | Moto Centar Zagorje" (SeoTitleStrategy), a `data.description`
 * ide u opis za Google i pregled linka. Trgovina i proizvod nemaju `title` – oznake postavljaju same.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    title: 'ATV, UTV i motocikli',
  },

  // ---------- Trgovina ----------
  {
    path: 'trgovina',
    loadComponent: () => import('./shop/shop-list/shop-list').then((m) => m.ShopList),
  },
  {
    path: 'trgovina/:kategorija',
    loadComponent: () => import('./shop/shop-list/shop-list').then((m) => m.ShopList),
  },
  {
    path: 'proizvod/:slug',
    loadComponent: () => import('./shop/product-detail/product-detail').then((m) => m.ProductDetail),
  },
  {
    path: 'kosarica',
    loadComponent: () => import('./shop/cart/cart').then((m) => m.Cart),
    title: 'Košarica',
    data: { noindex: true },
  },
  {
    path: 'blagajna',
    loadComponent: () => import('./shop/checkout/checkout').then((m) => m.Checkout),
    title: 'Blagajna',
    data: { noindex: true },
  },
  {
    path: 'narudzba/:broj',
    loadComponent: () => import('./shop/order-success/order-success').then((m) => m.OrderSuccess),
    title: 'Narudžba zaprimljena',
    data: { noindex: true },
  },

  // ---------- Stranice ----------
  {
    path: 'servis',
    loadComponent: () => import('./pages/servis/servis').then((m) => m.Servis),
    title: 'Servis',
    data: {
      description:
        'Servis ATV i UTV vozila i motocikala u Bedekovčini: redovni servis, dijagnostika, popravci i rezervni dijelovi. Dogovorite termin telefonom ili putem obrasca.',
    },
  },
  {
    path: 'kontakt',
    loadComponent: () => import('./pages/kontakt/kontakt').then((m) => m.Kontakt),
    title: 'Kontakt',
    data: {
      description:
        'Moto Centar Zagorje, Antuna Mihanovića 80, Bedekovčina. Telefon 099 435 1968, e-mail info@motocentarzagorje.hr. Radno vrijeme i upute za dolazak.',
    },
  },
  {
    path: 'politika-privatnosti',
    loadComponent: () => import('./pages/legal/legal').then((m) => m.Legal),
    title: 'Politika privatnosti',
    data: { page: 'privacy', description: 'Kako Moto Centar Zagorje prikuplja, koristi i čuva osobne podatke.' },
  },
  {
    path: 'opci-uvjeti',
    loadComponent: () => import('./pages/legal/legal').then((m) => m.Legal),
    title: 'Opći uvjeti poslovanja',
    data: { page: 'terms', description: 'Opći uvjeti kupnje, plaćanja, dostave i povrata u trgovini Moto Centra Zagorje.' },
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
    title: 'Stranica nije pronađena',
    data: { noindex: true },
  },
];
