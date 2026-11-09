/**
 * Produkcija (npm run build): prava domena, stranica se indeksira u Googleu.
 * Demo (npm run build:demo) koristi environment.demo.ts – vidi "demo" u angular.json.
 */
export const environment = {
  /** Domena bez "/" na kraju – za kanonske adrese i pregled linka (WhatsApp, Facebook…) */
  siteUrl: 'https://motocentarzagorje.hr',
  /** false = sve stranice dobiju <meta name="robots" content="noindex, nofollow"> */
  indexable: true,
};
