import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SITE } from '../../core/data/site';
import { ContactForm } from '../../shared/contact-form/contact-form';
import { Hours } from '../../shared/hours/hours';
import { Icon } from '../../shared/icon/icon';
import { PageHero } from '../../shared/page-hero/page-hero';

@Component({
  selector: 'app-kontakt',
  imports: [PageHero, ContactForm, Hours, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './kontakt.html',
  styleUrl: './kontakt.scss',
})
export class Kontakt {
  /** ?upit=Naziv proizvoda – dolazi sa stranice proizvoda */
  readonly upit = input<string>();

  protected readonly site = SITE;
  protected readonly prefill = computed(() => {
    const p = this.upit();
    return p ? `Zanima me ${p}. Molim informacije o dostupnosti i cijeni.` : undefined;
  });
  protected readonly topic = computed(() => (this.upit() ? `Upit za proizvod: ${this.upit()}` : 'Opći upit'));

  /** Karta se učitava tek na klik – Google ne dobiva podatke posjetitelja bez njegove radnje */
  protected readonly mapLoaded = signal(false);
  protected readonly mapUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl(SITE.mapsEmbed);
}
