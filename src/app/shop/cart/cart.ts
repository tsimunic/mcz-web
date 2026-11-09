import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EurPipe } from '../../core/pipes/eur.pipe';
import { CartService } from '../../core/services/cart.service';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-cart',
  imports: [RouterLink, EurPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class Cart {
  protected readonly cart = inject(CartService);

  protected setQty(id: string, value: string): void {
    const n = Math.floor(Number(value));
    if (Number.isFinite(n)) this.cart.setQty(id, n);
  }
}
