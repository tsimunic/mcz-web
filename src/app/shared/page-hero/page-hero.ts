import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contours, Hill } from '../contours/contours';

export interface Crumb {
  label: string;
  link?: string | unknown[];
}

/** Zaglavlje unutarnjih stranica: breadcrumb, naslov, uvod i opcionalna fotografija. */
@Component({
  selector: 'app-page-hero',
  imports: [RouterLink, Contours],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ph on-dark" [class.ph--image]="!!image()">
      <app-contours [hills]="hills" />
      @if (image()) {
        <img class="ph__img" [src]="image()" alt="" />
      }
      <div class="container ph__inner">
        @if (crumbs().length) {
          <nav class="crumbs" aria-label="Putanja">
            <ol role="list">
              <li><a routerLink="/">Naslovna</a></li>
              @for (c of crumbs(); track $index; let last = $last) {
                <li>
                  @if (c.link && !last) {
                    <a [routerLink]="c.link">{{ c.label }}</a>
                  } @else {
                    <span [attr.aria-current]="last ? 'page' : null">{{ c.label }}</span>
                  }
                </li>
              }
            </ol>
          </nav>
        }
        <h1 class="h-page">{{ title() }}</h1>
        @if (lead()) {
          <p class="lead ph__lead">{{ lead() }}</p>
        }
        <ng-content />
      </div>
    </section>
  `,
  styles: `
    .ph {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      padding-block: clamp(2.5rem, 6vw, 4.5rem) clamp(2.5rem, 5vw, 4rem);
      --contour-opacity: 0.1;
    }
    .ph--image {
      padding-block: clamp(4rem, 10vw, 8rem) clamp(2.5rem, 5vw, 4rem);
    }
    app-contours {
      z-index: -1;
    }
    .ph__img {
      position: absolute;
      inset: 0;
      z-index: -2;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.32;
      mix-blend-mode: luminosity;
    }
    .ph__inner {
      position: relative;
    }
    .crumbs ol {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin: 0 0 1.25rem;
      font-size: var(--fs-sm);
      color: var(--c-mist);
    }
    .crumbs li + li::before {
      content: '/';
      margin-right: 0.35rem;
      opacity: 0.6;
    }
    .crumbs a {
      color: inherit;
      text-decoration: none;
      &:hover {
        color: #fff;
        text-decoration: underline;
      }
    }
    .crumbs [aria-current] {
      color: #fff;
    }
    .ph__lead {
      margin-top: 1.25rem;
    }
  `,
})
export class PageHero {
  readonly title = input.required<string>();
  readonly lead = input<string>();
  readonly image = input<string>();
  readonly crumbs = input<Crumb[]>([]);

  protected readonly hills: Hill[] = [
    { x: 0.92, y: 0.15, rings: 26, gap: 30, seed: 11, squash: 0.7 },
  ];
}
