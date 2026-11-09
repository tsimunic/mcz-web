import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EurPipe } from '../../core/pipes/eur.pipe';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { displayName } from '../../core/utils/product-display';
import { Icon } from '../icon/icon';

export const AVAILABILITY_LABEL = {
  'in-stock': 'Na zalihi',
  'on-request': 'Dostupnost na upit',
  'out-of-stock': 'Trenutno nema na zalihi',
} as const;

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, EurPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  readonly product = input.required<Product>();
  protected readonly display = computed(() => displayName(this.product()));

  private readonly cart = inject(CartService);
  private readonly toast = inject(ToastService);
  protected readonly labels = AVAILABILITY_LABEL;

  protected add(): void {
    const p = this.product();
    this.cart.add(p);
    this.toast.show({
      title: 'Dodano u košaricu',
      text: p.name,
      image: p.images[0],
      action: { label: 'Otvori košaricu', link: '/kosarica' },
    });
  }
}
