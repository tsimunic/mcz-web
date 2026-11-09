import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { environment } from '../../../environments/environment';
import { SITE } from '../data/site';

/**
 * Naslov, opis i oznake za dijeljenje (WhatsApp, Facebook, Viber, LinkedIn, X) za svaku stranicu.
 *
 * Aplikacije za dijeljenje ne pokreću JavaScript – vide samo HTML koji server vrati. Zato se
 * stranice unaprijed generiraju (prerender, vidi app.routes.server.ts), pa svaki proizvod u
 * HTML-u već ima svoju fotografiju, naziv, cijenu i opis.
 */
export interface PageMeta {
  /** Bez sufiksa " | Moto Centar Zagorje" */
  title: string;
  description?: string;
  /** Putanja bez domene, npr. "/proizvod/linhai-atv-550" */
  path: string;
  /** Apsolutni URL slike; bez nje se koristi /og-image.jpg (1200×630) */
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'product';
  price?: number;
  /** Košarica, blagajna, 404 – ne prikazuju se u tražilicama */
  noindex?: boolean;
}

const SUFFIX = ' | ' + SITE.name;

export const DEFAULT_DESCRIPTION =
  'Moto Centar Zagorje, Bedekovčina: ATV i UTV vozila, motocikli, originalni dijelovi, servis kitovi i servis za Linhai, Segway, TGB, Hisun i Kayo.';

const DEFAULT_IMAGE = {
  url: SITE.url + '/og-image.jpg',
  width: '1200',
  height: '630',
  type: 'image/jpeg',
  alt: 'Moto Centar Zagorje – ATV, UTV i motocikli, prodaja, dijelovi i servis u Bedekovčini',
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);

  set(page: PageMeta): void {
    const title = page.title + SUFFIX;
    const description = clip(page.description || DEFAULT_DESCRIPTION, 200);
    const url = SITE.url + (page.path === '/' ? '/' : page.path.replace(/\/$/, ''));

    this.title.setTitle(title);
    this.tag('name', 'description', description);
    this.tag('property', 'og:type', page.type ?? 'website');
    this.tag('property', 'og:title', title);
    this.tag('property', 'og:description', description);
    this.tag('property', 'og:url', url);

    if (page.image) {
      this.tag('property', 'og:image', page.image);
      this.tag('property', 'og:image:alt', page.imageAlt ?? page.title);
      // dimenzije vlastitih fotografija nisu poznate – bolje izostaviti nego navesti krive
      for (const p of ['og:image:width', 'og:image:height', 'og:image:type']) this.meta.removeTag(`property="${p}"`);
    } else {
      this.tag('property', 'og:image', DEFAULT_IMAGE.url);
      this.tag('property', 'og:image:width', DEFAULT_IMAGE.width);
      this.tag('property', 'og:image:height', DEFAULT_IMAGE.height);
      this.tag('property', 'og:image:type', DEFAULT_IMAGE.type);
      this.tag('property', 'og:image:alt', DEFAULT_IMAGE.alt);
    }

    if (page.price != null) {
      this.tag('property', 'product:price:amount', page.price.toFixed(2));
      this.tag('property', 'product:price:currency', 'EUR');
    } else {
      this.meta.removeTag('property="product:price:amount"');
      this.meta.removeTag('property="product:price:currency"');
    }

    if (!environment.indexable) this.tag('name', 'robots', 'noindex, nofollow'); // demo
    else if (page.noindex) this.tag('name', 'robots', 'noindex, follow');
    else this.meta.removeTag('name="robots"');

    this.canonical(url);
  }

  private tag(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content }, `${attr}="${key}"`);
  }

  private canonical(url: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.rel = 'canonical';
      this.doc.head.appendChild(link);
    }
    link.href = url;
  }
}

/**
 * Stranice s `title` u ruti dobivaju oznake odavde (opis iz `data.description`).
 * Trgovina i proizvod nemaju `title` u ruti – oznake postavljaju same, kad znaju kategoriju ili proizvod.
 */
@Injectable({ providedIn: 'root' })
export class SeoTitleStrategy extends TitleStrategy {
  private readonly seo = inject(SeoService);

  override updateTitle(state: RouterStateSnapshot): void {
    const title = this.buildTitle(state);
    if (title === undefined) return;
    let route: ActivatedRouteSnapshot = state.root;
    while (route.firstChild) route = route.firstChild;
    this.seo.set({
      title,
      description: route.data['description'],
      noindex: route.data['noindex'],
      path: state.url.split(/[?#]/)[0] || '/',
    });
  }
}

/** Skraćuje na granici riječi */
function clip(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(' ', max - 1)).replace(/[,;:.–-]$/, '') + '…';
}
