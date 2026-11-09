import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { OPENING_HOURS } from '../../core/data/site';
import { OpeningHoursService } from '../../core/services/opening-hours.service';

@Component({
  selector: 'app-hours',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="status" [class.is-open]="status().open">
      <span class="dot" aria-hidden="true"></span>{{ status().label }}
    </p>
    <dl class="list">
      @for (d of days; track d.day; let i = $index) {
        <div class="row" [class.is-today]="i === status().todayIndex">
          <dt>
            {{ d.day }}
            @if (i === status().todayIndex) {
              <span class="sr-only">(danas)</span>
            }
          </dt>
          <dd class="tnum">{{ d.open ? d.open + ' – ' + d.close : 'Zatvoreno' }}</dd>
        </div>
      }
    </dl>
  `,
  styles: `
    :host {
      display: block;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      margin-bottom: 0.9rem;
      font-weight: 700;
      font-size: var(--fs-sm);
    }
    .dot {
      width: 0.55rem;
      height: 0.55rem;
      border-radius: 50%;
      background: var(--c-ink-3);
    }
    .is-open .dot {
      background: #3fbf6f;
      box-shadow: 0 0 0 4px rgba(63, 191, 111, 0.2);
    }
    .list {
      margin: 0;
      display: grid;
      gap: 0.1rem;
    }
    .row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.42rem 0.65rem;
      margin-inline: -0.65rem;
      border-radius: var(--r-sm);
      font-size: var(--fs-sm);
    }
    dd {
      margin: 0;
      opacity: 0.85;
    }
    .is-today {
      font-weight: 700;
      background: var(--hours-today-bg, rgba(27, 23, 20, 0.06));
      dd {
        opacity: 1;
      }
    }
  `,
})
export class Hours {
  protected readonly days = OPENING_HOURS;
  protected readonly status = inject(OpeningHoursService).status;
}
