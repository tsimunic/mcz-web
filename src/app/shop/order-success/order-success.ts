import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/data/site';
import { EurPipe } from '../../core/pipes/eur.pipe';
import { OrderService } from '../../core/services/order.service';
import { Contours, Hill } from '../../shared/contours/contours';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-order-success',
  imports: [RouterLink, EurPipe, Contours, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="done on-dark">
      <app-contours [hills]="hills" />
      <div class="container done__inner">
        <span class="done__check"><app-icon name="check" /></span>
        <h1 class="h-section">Narudžba je zaprimljena</h1>
        <p class="lead">
          Broj narudžbe: <b class="tnum">{{ broj() }}</b>.
          @if (order(); as o) {
            Potvrdu šaljemo na {{ o.customer.email }}.
          }
        </p>
      </div>
    </section>

    <section class="section next">
      <div class="container next__grid">
        @if (order(); as o) {
          <div class="card">
            <h2 class="card__title">Sažetak</h2>
            <ul role="list" class="lines">
              @for (l of o.lines; track l.productId) {
                <li>
                  <span>{{ l.qty }} × {{ l.name }}</span>
                  <span class="tnum">{{ l.price * l.qty | eur }}</span>
                </li>
              }
            </ul>
            <dl>
              <div><dt>Dostava</dt><dd>{{ o.shipping.label }}</dd></div>
              <div><dt>Plaćanje</dt><dd>{{ o.payment.label }}</dd></div>
              <div class="total"><dt>Ukupno</dt><dd class="tnum">{{ o.total | eur }}</dd></div>
            </dl>
          </div>
        }
        <div class="card">
          <h2 class="card__title">Što slijedi</h2>
          <ol role="list" class="steps">
            <li><span class="n tnum">1</span>Provjeravamo dostupnost i javljamo se telefonom ili e-mailom.</li>
            <li><span class="n tnum">2</span>Šaljemo podatke za plaćanje ili dogovaramo preuzimanje.</li>
            <li><span class="n tnum">3</span>Pripremamo narudžbu za slanje ili preuzimanje u Bedekovčini.</li>
          </ol>
          <p class="muted help">Pitanja o narudžbi? Nazovite <a [href]="site.phoneHref">{{ site.phone }}</a> i navedite broj narudžbe.</p>
          <a class="btn btn--dark btn--lg" routerLink="/trgovina">Nastavi kupovinu</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .done {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      padding-block: clamp(4rem, 9vw, 6.5rem);
      --contour-opacity: 0.12;
    }
    app-contours {
      z-index: -1;
    }
    .done__inner {
      display: grid;
      justify-items: start;
      gap: 1.25rem;
    }
    .done__check {
      display: grid;
      place-items: center;
      width: 4rem;
      height: 4rem;
      border-radius: 50%;
      background: #3fbf6f;
      color: var(--c-coal);
      --icon-stroke: 2.5;
      app-icon {
        width: 2rem;
        height: 2rem;
      }
    }
    .lead b {
      color: #fff;
    }
    .next__grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 380px), 1fr));
      gap: 1.25rem;
      align-items: start;
    }
    .card {
      display: grid;
      gap: 1.1rem;
      padding: clamp(1.5rem, 3vw, 2.25rem);
      border-radius: var(--r-lg);
      background: var(--c-paper);
      justify-items: start;
    }
    /* Mobitel: bijeli list od ruba do ruba, sadržaj poravnat s ostatkom stranice */
    @media (max-width: 600px) {
      .card {
        margin-inline: calc(var(--gutter) * -1);
        padding-inline: var(--gutter);
        border-radius: 0;
      }
    }
    .card__title {
      font-size: 1.75rem;
      font-weight: 800;
      font-stretch: 62%;
      text-transform: uppercase;
    }
    .lines,
    dl {
      display: grid;
      gap: 0.5rem;
      width: 100%;
      margin: 0;
      font-size: var(--fs-sm);
    }
    .lines li,
    dl div {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }
    dl {
      padding-top: 0.9rem;
      border-top: 1px solid var(--c-line);
    }
    dd {
      margin: 0;
      font-weight: 600;
    }
    .total dd {
      font-size: 1.4rem;
      font-weight: 800;
      font-stretch: 75%;
    }
    .steps {
      display: grid;
      gap: 0.85rem;
    }
    .steps li {
      display: flex;
      gap: 0.85rem;
      align-items: baseline;
    }
    .n {
      font-size: 1.75rem;
      font-weight: 800;
      font-stretch: 62%;
      color: var(--c-ink);
      line-height: 1;
    }
    .help a {
      font-weight: 700;
      color: var(--c-ink);
    }
  `,
})
export class OrderSuccess {
  readonly broj = input.required<string>();
  protected readonly site = SITE;
  private readonly orders = inject(OrderService);
  protected readonly order = computed(() => this.orders.lastOrder(this.broj()));
  protected readonly hills: Hill[] = [{ x: 0.85, y: 0.6, rings: 24, gap: 28, seed: 33, squash: 0.8 }];
}
