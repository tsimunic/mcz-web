import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';
import { SITE } from '../../core/data/site';
import { EurPipe } from '../../core/pipes/eur.pipe';
import { CartService } from '../../core/services/cart.service';
import { OpeningHoursService } from '../../core/services/opening-hours.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, EurPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header.html',
  styleUrl: './header.scss',
  host: {
    '(window:scroll)': 'onScroll()',
    '(document:keydown.escape)': 'menuOpen.set(false)',
  },
})
export class Header {
  protected readonly site = SITE;
  protected readonly cart = inject(CartService);
  protected readonly status = inject(OpeningHoursService).status;
  private readonly router = inject(Router);

  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);

  protected readonly nav = [
    { label: 'Naslovna', path: '/', exact: true },
    { label: 'Trgovina', path: '/trgovina', exact: false },
    { label: 'Servis', path: '/servis', exact: true },
    { label: 'Kontakt', path: '/kontakt', exact: true },
  ];

  constructor() {
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  protected onScroll(): void {
    this.scrolled.set(window.scrollY > 40);
  }

  protected search(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const q = input.value.trim();
    this.router.navigate(['/trgovina'], { queryParams: q ? { q } : {} });
    input.blur();
  }
}
