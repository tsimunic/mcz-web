import { ChangeDetectionStrategy, Component, ElementRef, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SITE, UPLOADS } from '../../core/data/site';
import { ContactService } from '../../core/services/contact.service';
import { Hours } from '../../shared/hours/hours';
import { Icon, IconName } from '../../shared/icon/icon';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-servis',
  imports: [ReactiveFormsModule, RouterLink, PageHero, Hours, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './servis.html',
  styleUrl: './servis.scss',
})
export class Servis {
  protected readonly site = SITE;
  protected readonly heroImage = UPLOADS + '2025/09/serviskit.webp';

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly contact = inject(ContactService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly services: { icon: IconName; title: string; text: string }[] = [
    { icon: 'wrench', title: 'Redovni servis', text: 'Zamjena ulja, filtera, svjećica i pregled vozila prema preporuci proizvođača.' },
    { icon: 'shield', title: 'Dijagnostika i popravci', text: 'Pronalazimo uzrok kvara i dogovaramo popravak prije nego krenemo s radom.' },
    { icon: 'box', title: 'Rezervni dijelovi', text: 'Dijelovi za Linhai, Segway, TGB, CF Moto i Polaris, iz trgovine ili po narudžbi.' },
    { icon: 'calendar', title: 'Priprema za sezonu', text: 'Provjera kočnica, guma, ovjesa i akumulatora prije prve ozbiljne vožnje.' },
  ];

  protected readonly steps = [
    { title: 'Javite se', text: 'Nazovite ili ispunite obrazac na ovoj stranici.' },
    { title: 'Dogovorimo termin', text: 'Potvrdimo termin i okvirnu cijenu radova.' },
    { title: 'Dovezite vozilo', text: `U radionicu na adresi ${SITE.street}, ${SITE.city}.` },
    { title: 'Preuzmite vozilo', text: 'Javimo kad je gotovo i objasnimo što smo napravili.' },
  ];

  protected readonly serviceTypes = ['Redovni servis', 'Dijagnostika / kvar', 'Zamjena guma', 'Priprema za sezonu', 'Nešto drugo'];

  protected readonly sending = signal(false);
  protected readonly sent = signal(false);

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.email],
    vehicle: ['', Validators.required],
    type: ['Redovni servis'],
    date: [''],
    message: [''],
    consent: [false, Validators.requiredTrue],
  });

  protected invalid(name: 'name' | 'phone' | 'email' | 'vehicle' | 'consent'): boolean {
    const c = this.form.controls[name];
    return c.invalid && c.touched;
  }

  protected async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.host.nativeElement.querySelector<HTMLElement>('form .ng-invalid')?.focus();
      return;
    }
    this.sending.set(true);
    const v = this.form.getRawValue();
    await this.contact.send({
      name: v.name,
      phone: v.phone,
      email: v.email,
      topic: 'Narudžba servisa',
      message: `Vozilo: ${v.vehicle}\nVrsta: ${v.type}\nŽeljeni datum: ${v.date || 'nije naveden'}\n\n${v.message}`,
    });
    this.sending.set(false);
    this.sent.set(true);
  }

  protected reset(): void {
    this.form.reset();
    this.sent.set(false);
  }
}
