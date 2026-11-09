import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/data/site';
import { PageHero } from '../../shared/page-hero/page-hero';

interface LegalSection {
  heading: string;
  body: string;
}

/**
 * Pravne stranice – OKVIR.
 * Zamijenite tekstove u LEGAL_CONTENT konačnim tekstom (npr. iz postojeće stranice ili od pravnika).
 */
const LEGAL_CONTENT: Record<'privacy' | 'terms', { title: string; lead: string; sections: LegalSection[] }> = {
  privacy: {
    title: 'Politika privatnosti',
    lead: 'Kako prikupljamo, koristimo i štitimo vaše osobne podatke.',
    sections: [
      { heading: 'Voditelj obrade', body: `${SITE.name}, ${SITE.street}, ${SITE.city}. Kontakt: ${SITE.email}.` },
      { heading: 'Koje podatke prikupljamo', body: 'Ovdje dolazi popis podataka koje prikupljate putem kontakt obrasca, narudžbe servisa i web trgovine.' },
      { heading: 'Svrha i pravna osnova obrade', body: 'Ovdje dolazi opis svrhe obrade (odgovor na upit, izvršenje narudžbe, zakonske obveze) i pravne osnove.' },
      { heading: 'Kolačići', body: 'Ovdje dolazi opis kolačića koje stranica koristi i načina upravljanja privolom.' },
      { heading: 'Vaša prava', body: 'Ovdje dolazi opis prava na pristup, ispravak, brisanje, ograničenje obrade, prigovor i prenosivost podataka.' },
    ],
  },
  terms: {
    title: 'Opći uvjeti poslovanja',
    lead: 'Uvjeti kupnje u web trgovini Moto Centra Zagorje.',
    sections: [
      { heading: 'Opće odredbe', body: 'Ovdje dolaze podaci o prodavatelju (naziv, OIB, adresa) i područje primjene uvjeta.' },
      { heading: 'Narudžba i sklapanje ugovora', body: 'Ovdje dolazi opis postupka narudžbe i trenutka sklapanja ugovora.' },
      { heading: 'Cijene i plaćanje', body: 'Ovdje dolaze informacije o cijenama, PDV-u i načinima plaćanja.' },
      { heading: 'Dostava', body: 'Ovdje dolaze rokovi, cijene i područje dostave te uvjeti osobnog preuzimanja.' },
      { heading: 'Povrat i reklamacije', body: 'Ovdje dolazi postupak jednostranog raskida ugovora, povrata robe i reklamacija.' },
      { heading: 'Jamstvo', body: 'Ovdje dolaze uvjeti jamstva za vozila, dijelove i opremu.' },
    ],
  },
};

@Component({
  selector: 'app-legal',
  imports: [PageHero, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @let c = content();
    <app-page-hero [title]="c.title" [lead]="c.lead" [crumbs]="[{ label: c.title }]" />
    <section class="section">
      <div class="container">
        <article class="prose doc">
          @for (s of c.sections; track s.heading) {
            <h2>{{ s.heading }}</h2>
            <p>{{ s.body }}</p>
          }
          <h2>Pitanja</h2>
          <p>Za sva pitanja pišite na <a [href]="'mailto:' + email">{{ email }}</a> ili nas <a routerLink="/kontakt">kontaktirajte</a>.</p>
        </article>
      </div>
    </section>
  `,
  styles: `
    .doc {
      padding: clamp(1.5rem, 4vw, 3rem);
      border-radius: var(--r-lg);
      background: var(--c-paper);
      max-width: 820px;
    }
    @media (max-width: 600px) {
      .doc {
        margin-inline: calc(var(--gutter) * -1);
        padding-inline: var(--gutter);
        border-radius: 0;
      }
    }
    .doc > h2:first-child {
      margin-top: 0;
    }
  `,
})
export class Legal {
  /** Dolazi iz route data */
  readonly page = input<'privacy' | 'terms'>('privacy');
  protected readonly content = computed(() => LEGAL_CONTENT[this.page()]);
  protected readonly email = SITE.email;
}
