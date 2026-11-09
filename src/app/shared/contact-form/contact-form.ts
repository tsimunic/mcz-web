import { ChangeDetectionStrategy, Component, ElementRef, effect, inject, input, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContactService } from '../../core/services/contact.service';
import { Icon } from '../icon/icon';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, RouterLink, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (sent()) {
      <div class="notice" role="status">
        <app-icon name="check" />
        <div>
          <p>Poruka je poslana.</p>
          <p class="sub">Javit ćemo vam se u radno vrijeme.</p>
        </div>
      </div>
      <button type="button" class="btn btn--outline again" (click)="reset()">Pošalji novu poruku</button>
    } @else {
      <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="form-grid">
        <div class="field">
          <label for="cf-name">Ime i prezime <span class="req" aria-hidden="true">*</span></label>
          <input id="cf-name" class="input" formControlName="name" autocomplete="name" [attr.aria-invalid]="invalid('name')" aria-describedby="cf-name-err" />
          @if (invalid('name')) {
            <p class="field-error" id="cf-name-err">Upišite ime i prezime.</p>
          }
        </div>
        <div class="field">
          <label for="cf-phone">Kontakt broj</label>
          <input id="cf-phone" class="input" type="tel" formControlName="phone" autocomplete="tel" inputmode="tel" />
        </div>
        <div class="field span-2">
          <label for="cf-email">E-mail <span class="req" aria-hidden="true">*</span></label>
          <input id="cf-email" class="input" type="email" formControlName="email" autocomplete="email" [attr.aria-invalid]="invalid('email')" aria-describedby="cf-email-err" />
          @if (invalid('email')) {
            <p class="field-error" id="cf-email-err">Upišite ispravnu e-mail adresu, npr. ime&#64;primjer.hr</p>
          }
        </div>
        <div class="field span-2">
          <label for="cf-msg">Poruka <span class="req" aria-hidden="true">*</span></label>
          <textarea id="cf-msg" class="textarea" formControlName="message" rows="5" [attr.aria-invalid]="invalid('message')" aria-describedby="cf-msg-err"></textarea>
          @if (invalid('message')) {
            <p class="field-error" id="cf-msg-err">Napišite kratku poruku.</p>
          }
        </div>
        <div class="span-2">
          <label class="check">
            <input type="checkbox" formControlName="consent" />
            <span>Pristajem na obradu podataka radi odgovora na upit, prema <a routerLink="/politika-privatnosti">politici privatnosti</a>.</span>
          </label>
          @if (invalid('consent')) {
            <p class="field-error">Za slanje poruke potrebna je vaša privola.</p>
          }
        </div>
        <div class="span-2 actions">
          <button type="submit" class="btn btn--primary btn--lg" [disabled]="sending()">
            {{ sending() ? 'Šaljem…' : submitLabel() }}
          </button>
        </div>
      </form>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .actions {
      margin-top: 0.25rem;
    }
    .sub {
      font-weight: 500;
      margin-top: 0.15rem;
    }
    .again {
      margin-top: 1rem;
    }
  `,
})
export class ContactForm {
  /** Unaprijed popunjena poruka (npr. upit za proizvod) */
  readonly prefill = input<string>();
  readonly topic = input<string>('Opći upit');
  readonly submitLabel = input<string>('Pošalji poruku');

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly contact = inject(ContactService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly sending = signal(false);
  protected readonly sent = signal(false);

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    phone: [''],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required],
    consent: [false, Validators.requiredTrue],
  });

  constructor() {
    effect(() => {
      const text = this.prefill();
      if (text) this.form.controls.message.setValue(text);
    });
  }

  protected invalid(name: 'name' | 'phone' | 'email' | 'message' | 'consent'): boolean {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.host.nativeElement.querySelector<HTMLElement>('.ng-invalid:not(form)')?.focus();
      return;
    }
    this.sending.set(true);
    const { consent, ...msg } = this.form.getRawValue();
    await this.contact.send({ ...msg, topic: this.topic() });
    this.sending.set(false);
    this.sent.set(true);
  }

  protected reset(): void {
    this.form.reset();
    this.sent.set(false);
  }
}
