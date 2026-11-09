import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
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

  /** Automatska izmjena: trajanje slajda je u CSS-u (--hero-delay), traka na aktivnoj kartici je mjerač. */
  protected readonly playing = signal(false);
  private readonly inView = signal(true);
  private readonly pageHidden = signal(false);
  /** Prst/miš je spušten na banner – izmjena stoji dok se ne pusti */
  private readonly held = signal(false);
  protected readonly paused = computed(() => this.held() || !this.inView() || this.pageHidden());

  /** Pomak sadržaja dok se povlači (px) */
  protected readonly dragX = signal(0);
  protected readonly dragging = computed(() => this.dragX() !== 0);
  /** Sadržaj prati prst upola sporije i lagano blijedi – jasno je da se slajd mijenja */
  protected readonly stageTransform = computed(() => (this.dragging() ? `translateX(${this.dragX() * 0.5}px)` : null));
  protected readonly stageOpacity = computed(() =>
    this.dragging() ? 1 - Math.min(Math.abs(this.dragX()) / 500, 0.5) : null,
  );

  private readonly hero = viewChild<ElementRef<HTMLElement>>('hero');
  private drag: { id: number; x: number; y: number; axis?: 'x' | 'y' } | null = null;
  private suppressClick = false;
  private wheelX = 0;
  private wheelLock = 0;

  protected readonly heroHills: Hill[] = [{ x: -0.05, y: 1.1, rings: 34, gap: 32, seed: 5, squash: 0.72 }];
  protected readonly bandHills: Hill[] = [{ x: 1.02, y: 0.55, rings: 30, gap: 30, seed: 17, squash: 0.85 }];

  constructor() {
    const destroyRef = inject(DestroyRef);

    // Samo u pregledniku (ne pri generiranju stranica)
    afterNextRender(() => {
      const el = this.hero()?.nativeElement;
      if (!el) return;

      // Bez automatske izmjene za korisnike koji su u sustavu isključili animacije
      this.playing.set(!matchMedia('(prefers-reduced-motion: reduce)').matches);

      // Stani kad banner nije na ekranu ili je kartica preglednika u pozadini
      const io = new IntersectionObserver(([e]) => this.inView.set(e.isIntersecting), { threshold: 0.35 });
      io.observe(el);
      const onVisibility = () => this.pageHidden.set(document.hidden);
      document.addEventListener('visibilitychange', onVisibility);

      // Nakon povlačenja ne otvaraj link na kojem je prst pušten
      const onClickCapture = (e: MouseEvent) => {
        if (!this.suppressClick) return;
        e.preventDefault();
        e.stopPropagation();
        this.suppressClick = false;
      };
      el.addEventListener('click', onClickCapture, true);

      destroyRef.onDestroy(() => {
        io.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        el.removeEventListener('click', onClickCapture, true);
      });
    });
  }

  protected select(i: number): void {
    this.active.set(i);
  }

  protected next(): void {
    this.active.update((i) => (i + 1) % this.slides.length);
  }

  protected prev(): void {
    this.active.update((i) => (i - 1 + this.slides.length) % this.slides.length);
  }

  protected toggleAutoplay(): void {
    this.playing.update((p) => !p);
  }

  /** Traka na aktivnoj kartici se napunila → sljedeći slajd */
  protected onBarEnd(event: AnimationEvent): void {
    if (event.target === event.currentTarget) this.next();
  }

  // ---------- Povlačenje: prst na mobitelu, miš na desktopu ----------
  protected onPointerDown(e: PointerEvent): void {
    if (!e.isPrimary || e.button !== 0) return;
    this.drag = { id: e.pointerId, x: e.clientX, y: e.clientY };
    this.held.set(true);
  }

  protected onPointerMove(e: PointerEvent): void {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      // Okomiti pokret je skrolanje stranice – banner ga ne dira
      d.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
      if (d.axis === 'x') {
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); // prst smije izaći iz bannera
        } catch {
          /* pokazivač je već pušten – povlačenje radi i bez hvatanja */
        }
      }
    }
    if (d.axis === 'x') this.dragX.set(dx);
  }

  protected onPointerUp(e: PointerEvent): void {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    this.drag = null;
    this.held.set(false);
    const dx = this.dragX();
    this.dragX.set(0);
    if (d.axis !== 'x') return;
    this.suppressClick = true;
    setTimeout(() => (this.suppressClick = false)); // ako klik ne stigne, ne blokiraj sljedeći
    const width = (e.currentTarget as HTMLElement).clientWidth;
    if (Math.abs(dx) > Math.min(80, width * 0.15)) {
      if (dx < 0) this.next();
      else this.prev();
    }
  }

  protected onPointerCancel(): void {
    this.drag = null;
    this.held.set(false);
    this.dragX.set(0);
  }

  /** Vodoravni pokret dva prsta na touchpadu (desktop) */
  protected onWheel(e: WheelEvent): void {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault(); // inače preglednik vodoravni pokret tumači kao "natrag"
    if (Date.now() < this.wheelLock) return;
    this.wheelX += e.deltaX;
    if (Math.abs(this.wheelX) > 60) {
      if (this.wheelX > 0) this.next();
      else this.prev();
      this.wheelX = 0;
      this.wheelLock = Date.now() + 700; // jedan pokret = jedan slajd (touchpad šalje inerciju)
    }
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
