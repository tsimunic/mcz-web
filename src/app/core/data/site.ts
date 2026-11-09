/** Osnovni podaci o poslovanju – mijenjajte ovdje, koristi se kroz cijelu stranicu. */
import { environment } from '../../../environments/environment';

/** Slike se trenutno učitavaju s postojeće stranice. Prije objave ih prebacite u /public i promijenite ovu putanju. */
export const UPLOADS = 'https://motocentarzagorje.hr/wp-content/uploads/';

export const SITE = {
  name: 'Moto Centar Zagorje',
  /** Domena stranice – za kanonske adrese i pregled linka. Mijenja se u src/environments/ (produkcija / demo). */
  url: environment.siteUrl,
  phone: '099 435 1968',
  phoneHref: 'tel:+385994351968',
  email: 'info@motocentarzagorje.hr',
  street: 'Antuna Mihanovića 80',
  city: 'Bedekovčina',
  country: 'Hrvatska',
  logo: UPLOADS + '2025/08/mcz_logo_final-raster_500x500-150x150.png',
  mapsLink: 'https://www.google.com/maps/search/?api=1&query=Antuna+Mihanovi%C4%87a+80%2C+Bedekov%C4%8Dina',
  mapsEmbed: 'https://www.google.com/maps?q=Antuna%20Mihanovi%C4%87a%2080%2C%20Bedekov%C4%8Dina&output=embed',
  social: {
    facebook: 'https://www.facebook.com/motocentarzagorje',
    instagram: 'https://www.instagram.com/motocentarzagorje',
    youtube: 'https://www.youtube.com/@MotoCentarZagorje',
  },
} as const;

export interface OpeningDay {
  day: string;
  /** Oblik za "otvaramo u …" */
  dayAcc: string;
  open: string | null;
  close: string | null;
}

/** Radno vrijeme, indeks 0 = ponedjeljak */
export const OPENING_HOURS: OpeningDay[] = [
  { day: 'Ponedjeljak', dayAcc: 'ponedjeljak', open: '08:00', close: '16:00' },
  { day: 'Utorak', dayAcc: 'utorak', open: '08:00', close: '16:00' },
  { day: 'Srijeda', dayAcc: 'srijedu', open: '08:00', close: '16:00' },
  { day: 'Četvrtak', dayAcc: 'četvrtak', open: '08:00', close: '16:00' },
  { day: 'Petak', dayAcc: 'petak', open: '08:00', close: '16:00' },
  { day: 'Subota', dayAcc: 'subotu', open: '08:00', close: '12:00' },
  { day: 'Nedjelja', dayAcc: 'nedjelju', open: null, close: null },
];
