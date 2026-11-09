import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PAYMENT_METHODS, SHIPPING_METHODS } from '../../core/data/shop-config';
import { EurPipe } from '../../core/pipes/eur.pipe';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { Icon } from '../../shared/icon/icon';

type Field = 'firstName' | 'lastName' | 'email' | 'phone' | 'street' | 'zip' | 'city' | 'terms';

/**
 * Blagajna – OKVIR.
 * Obrazac, validacija i sažetak rade; slanje narudžbe je simulacija u OrderService.
 * Kartično plaćanje (npr. CorvusPay, Stripe, WSPay) spaja se u OrderService.placeOrder.
 */
@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, RouterLink, EurPipe, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss',
})
export class Checkout {
  protected readonly cart = inject(CartService);
  private readonly orders = inject(OrderService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly shippingMethods = SHIPPING_METHODS;
  protected readonly submitting = signal(false);

  protected readonly form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    street: [''],
    zip: [''],
    city: [''],
    country: ['Hrvatska'],
    shipping: [SHIPPING_METHODS[0].id],
    payment: [PAYMENT_METHODS[0].id],
    note: [''],
    terms: [false, Validators.requiredTrue],
  });

  private readonly shippingId = toSignal(this.form.controls.shipping.valueChanges, {
    initialValue: this.form.controls.shipping.value,
  });

  protected readonly shipping = computed(
    () => SHIPPING_METHODS.find((s) => s.id === this.shippingId()) ?? SHIPPING_METHODS[0],
  );

  protected readonly payments = computed(() =>
    PAYMENT_METHODS.filter((p) => !p.onlyFor || p.onlyFor.includes(this.shippingId())),
  );

  protected readonly total = computed(() => this.cart.subtotal() + (this.shipping().price ?? 0));

  constructor() {
    this.form.controls.shipping.valueChanges.pipe(takeUntilDestroyed()).subscribe((id) => {
      const method = SHIPPING_METHODS.find((s) => s.id === id);
      const { street, zip, city, payment } = this.form.controls;
      if (method?.requiresAddress) {
        street.setValidators(Validators.required);
        city.setValidators(Validators.required);
        zip.setValidators([Validators.required, Validators.pattern(/^\d{5}$/)]);
      } else {
        [street, zip, city].forEach((c) => c.clearValidators());
      }
      [street, zip, city].forEach((c) => c.updateValueAndValidity());

      // Ako odabrani način plaćanja nije dostupan uz novu dostavu, vrati na prvi dostupni
      const available = PAYMENT_METHODS.filter((p) => !p.disabled && (!p.onlyFor || p.onlyFor.includes(id)));
      if (!available.some((p) => p.id === payment.value)) payment.setValue(available[0]?.id ?? '');
    });
  }

  protected invalid(name: Field): boolean {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.host.nativeElement.querySelector<HTMLElement>('form .ng-invalid')?.focus();
      return;
    }
    const v = this.form.getRawValue();
    const payment = PAYMENT_METHODS.find((p) => p.id === v.payment) ?? PAYMENT_METHODS[0];

    this.submitting.set(true);
    try {
      const order = await this.orders.placeOrder(
        {
          firstName: v.firstName,
          lastName: v.lastName,
          email: v.email,
          phone: v.phone,
          street: v.street,
          zip: v.zip,
          city: v.city,
          country: v.country,
          note: v.note,
        },
        this.shipping(),
        payment,
      );
      await this.router.navigate(['/narudzba', order.number]);
    } finally {
      this.submitting.set(false);
    }
  }
}
