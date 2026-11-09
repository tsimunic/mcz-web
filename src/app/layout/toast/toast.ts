import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ToastService } from '../../core/services/toast.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-toasts',
  imports: [RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="stack" role="status" aria-live="polite">
      @for (t of toasts.toasts(); track t.id) {
        <div class="toast">
          @if (t.image) {
            <img [src]="t.image" alt="" width="56" height="56" />
          } @else {
            <span class="toast__icon"><app-icon name="check" /></span>
          }
          <div class="toast__body">
            <p class="toast__title"><app-icon name="check" />{{ t.title }}</p>
            @if (t.text) {
              <p class="toast__text">{{ t.text }}</p>
            }
            @if (t.action) {
              <a class="toast__action" [routerLink]="t.action.link" (click)="toasts.dismiss(t.id)">{{ t.action.label }}</a>
            }
          </div>
          <button type="button" class="toast__close" (click)="toasts.dismiss(t.id)" aria-label="Zatvori obavijest">
            <app-icon name="close" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .stack {
      position: fixed;
      right: max(16px, env(safe-area-inset-right));
      bottom: max(16px, env(safe-area-inset-bottom));
      z-index: 60;
      display: grid;
      gap: 0.6rem;
      width: min(380px, calc(100vw - 32px));
    }
    .toast {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      padding: 0.85rem;
      border-radius: var(--r-md);
      background: var(--c-ink);
      color: #fff;
      box-shadow: 0 20px 50px -20px rgba(0, 0, 0, 0.5);
      animation: in 0.3s var(--ease);
    }
    img {
      width: 56px;
      height: 56px;
      border-radius: var(--r-sm);
      object-fit: cover;
      background: var(--c-stone);
      flex: none;
    }
    .toast__body {
      flex: 1;
      min-width: 0;
    }
    .toast__title {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-weight: 700;
      font-size: var(--fs-sm);
      color: #9be3b5;
      app-icon {
        width: 1rem;
        height: 1rem;
      }
    }
    .toast__text {
      margin-top: 0.15rem;
      font-size: var(--fs-sm);
      line-height: 1.35;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .toast__action {
      display: inline-block;
      margin-top: 0.45rem;
      font-size: var(--fs-sm);
      font-weight: 700;
      color: #fff;
      text-decoration-color: var(--c-orange);
      text-decoration-thickness: 2px;
    }
    .toast__close {
      display: grid;
      place-items: center;
      width: 2rem;
      height: 2rem;
      border: 0;
      border-radius: var(--r-sm);
      background: transparent;
      color: #c9c2b7;
      flex: none;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: #fff;
      }
      app-icon {
        width: 1rem;
        height: 1rem;
      }
    }
    .toast__icon {
      display: none;
    }
    @keyframes in {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
    }
  `,
})
export class Toasts {
  protected readonly toasts = inject(ToastService);
}
