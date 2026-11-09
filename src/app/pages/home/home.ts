import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND_LOGOS, BRANDS } from '../../core/data/categories.data';
import { SITE, UPLOADS } from '../../core/data/site';
import { EurPipe } from '../../core/pipes/eur.pipe';
import { ProductService } from '../../core/services/product.service';
import { PRODUCT_FORMS, plural } from '../../core/utils/plural';
import { ContactForm } from '../../shared/contact-form/contact-form';
import { Contours, Hill } from '../../shared/contours/contours';
import { Hours } from '../../shared/hours/hours';
import { Icon } from '../../shared/icon/icon';
import { ProductCard } from '../../shared/product-card/product-card';

interface Slide {
  id: string;
  tab: string;
  title: string;
  text: string;
  image: string;
  focus: string;
  primary: { label: string; link?: string; href?: string };
  price?: number;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, EurPipe, Contours, Hours, Icon, ProductCard, ContactForm],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly shop = inject(ProductService);
  protected readonly site = SITE;
  protected readonly img = UPLOADS;

  // ---------- Hero ----------
  protected readonly slides: Slide[] = [
    {
      id: 'atv110',
      tab: 'Linhai ATV 110',
      title: 'Linhai ATV 110',
      text: 'Savršen prvi korak u svijet off-road avantura. Dizajniran za mlade vozače: pouzdana kontrola i bezbrižna vožnja na svakom terenu.',
      image: UPLOADS + '2026/03/AT110_LIFESTYLE-7-Large-1536x1024.webp',
      focus: '60% 40%',
      primary: { label: 'Pogledaj Linhai 110', link: '/proizvod/linhai-atv-110-4x2-efi-ce' },
      price: 1890,
    },
    {
      id: 'podcast',
      tab: 'Podcast Pod gasom',
      title: 'Pod gasom',
      text: 'Naš podcast o moto sportu i adrenalinu. Nova epizoda sa zanimljivim gostima izlazi svakog 1. u mjesecu.',
      image: UPLOADS + '2026/03/pod-gasom-hero-1536x864.webp',
      focus: '70% 30%',
      primary: { label: 'Gledaj na YouTubeu', href: SITE.social.youtube },
    },
  ];
  protected readonly active = signal(0);
  protected readonly current = computed(() => [this.slides[this.active()]]);

  protected readonly heroHills: Hill[] = [{ x: -0.05, y: 1.1, rings: 34, gap: 32, seed: 5, squash: 0.72 }];
  protected readonly bandHills: Hill[] = [{ x: 1.02, y: 0.55, rings: 30, gap: 30, seed: 17, squash: 0.85 }];

  protected select(i: number): void {
    this.active.set(i);
  }

  protected onTabKey(event: KeyboardEvent): void {
    const n = this.slides.length;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const next = (this.active() + (event.key === 'ArrowRight' ? 1 : n - 1)) % n;
      this.active.set(next);
      (event.currentTarget as HTMLElement).parentElement
        ?.querySelectorAll<HTMLButtonElement>('[role="tab"]')
        [next]?.focus();
    }
  }

  // ---------- Izdvojeno ----------
  protected readonly brandFilter = signal<string>('sve');
  protected readonly brandChips = computed(() =>
    BRANDS.map((slug) => ({ slug, name: this.shop.category(slug)?.name ?? slug })),
  );
  private readonly vehicles = computed(() => this.shop.inCategory('vozila'));
  protected readonly vehicleCount = computed(() => this.vehicles().length);
  protected readonly featured = computed(() => {
    const f = this.brandFilter();
    const vehicles = this.vehicles();
    const pool = f === 'sve' ? vehicles : this.shop.inCategory(f);
    return this.shop
      .featured()
      .filter((p) => pool.includes(p))
      .slice(0, 8);
  });

  // ---------- Brendovi ----------
  protected readonly brands = computed(() =>
    BRANDS.map((slug) => {
      const count = this.shop.inCategory(slug).length;
      return {
        slug,
        name: this.shop.category(slug)?.name ?? slug,
        logo: BRAND_LOGOS[slug],
        label: `${count} ${plural(count, PRODUCT_FORMS)}`,
      };
    }),
  );

  protected readonly serviceSteps = [
    { title: 'Javite se', text: 'Nazovite ili pošaljite upit s modelom vozila i opisom problema.' },
    { title: 'Dogovorimo termin', text: 'Predložimo prvi slobodan termin i okvirnu cijenu.' },
    { title: 'Dovezite vozilo', text: 'U radionicu u Bedekovčini, u radno vrijeme.' },
    { title: 'Preuzmite ga spremnog', text: 'Javimo kad je gotovo i što smo napravili.' },
  ];
}
