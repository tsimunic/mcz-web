import { Category } from '../models/product.model';
import { UPLOADS } from './site';

/** Stablo kategorija (preuzeto s postojeće trgovine). Redoslijed = redoslijed prikaza. */
export const CATEGORIES: Category[] = [
  { slug: 'posebna-ponuda', name: 'Posebna ponuda' },

  { slug: 'vozila', name: 'Vozila', description: 'ATV, UTV i motocikli za rad, rekreaciju i prve vožnje.' },
  { slug: 'linhai', name: 'Linhai', parent: 'vozila' },
  { slug: 'segway', name: 'Segway', parent: 'vozila' },
  { slug: 'tgb', name: 'TGB', parent: 'vozila' },
  { slug: 'hisun', name: 'Hisun', parent: 'vozila' },
  { slug: 'kayo', name: 'Kayo', parent: 'vozila' },

  { slug: 'dijelovi', name: 'Dijelovi', description: 'Originalni i zamjenski dijelovi za ATV, UTV i motocikle.' },
  { slug: 'linhai-dijelovi', name: 'Linhai dijelovi', parent: 'dijelovi' },
  { slug: 'segway-dijelovi', name: 'Segway dijelovi', parent: 'dijelovi' },
  { slug: 'tgb-dijelovi', name: 'TGB dijelovi', parent: 'dijelovi' },
  { slug: 'cf-moto-dijelovi', name: 'CF Moto dijelovi', parent: 'dijelovi' },
  { slug: 'polaris-dijelovi', name: 'Polaris dijelovi', parent: 'dijelovi' },
  { slug: 'gume', name: 'Gume', parent: 'dijelovi' },
  { slug: 'odrzavanje', name: 'Održavanje', parent: 'dijelovi' },
  { slug: 'filteri', name: 'Filteri', parent: 'odrzavanje' },
  { slug: 'ulja', name: 'Ulja', parent: 'odrzavanje' },

  { slug: 'service-kit', name: 'Servis kitovi', description: 'Kompleti za redovni servis: sve na jednom mjestu, za vaš model.' },

  { slug: 'dodatna-oprema', name: 'Dodatna oprema' },
  { slug: 'koferi', name: 'Koferi', parent: 'dodatna-oprema' },
  { slug: 'ostalo', name: 'Ostalo', parent: 'dodatna-oprema' },
];

/** Brendovi vozila – slug odgovara kategoriji */
export const BRANDS = ['linhai', 'segway', 'tgb', 'hisun', 'kayo'] as const;

/** Logotipi s postojeće stranice (kvadratni 300×300, logo je u srednjem pojasu). Hisun nema logo – prikazuje se naziv. */
export const BRAND_LOGOS: Partial<Record<(typeof BRANDS)[number], string>> = {
  linhai: UPLOADS + '2025/09/5.svg',
  segway: UPLOADS + '2025/09/3.svg',
  tgb: UPLOADS + '2025/09/1.svg',
  kayo: UPLOADS + '2025/09/6.svg',
};
