import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contours, Hill } from '../../shared/contours/contours';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, Contours],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="nf on-dark">
      <app-contours [hills]="hills" />
      <div class="container nf__inner">
        <p class="nf__code display" aria-hidden="true">404</p>
        <h1 class="h-section">Skrenuli ste s puta</h1>
        <p class="lead">Ova stranica ne postoji ili je premještena. Provjerite adresu ili nastavite s jednog od ovih mjesta.</p>
        <div class="nf__actions">
          <a class="btn btn--primary btn--lg" routerLink="/">Na naslovnicu</a>
          <a class="btn btn--ghost btn--lg" routerLink="/trgovina">U trgovinu</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    .nf {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      padding-block: clamp(5rem, 12vw, 9rem);
      --contour-opacity: 0.14;
    }
    app-contours {
      z-index: -1;
    }
    .nf__inner {
      display: grid;
      gap: 1.25rem;
      justify-items: start;
    }
    .nf__code {
      font-size: clamp(7rem, 22vw, 16rem);
      color: var(--c-orange);
    }
    .nf__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }
  `,
})
export class NotFound {
  protected readonly hills: Hill[] = [{ x: 0.75, y: 0.5, rings: 30, gap: 26, seed: 404, squash: 0.8 }];
}
