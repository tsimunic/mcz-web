# Moto Centar Zagorje – web stranica i okvir web shopa

Angular 21 (standalone komponente, signali, zoneless). Novi dizajn postojeće stranice motocentarzagorje.hr.

## Pokretanje

```bash
npm install
npm start          # http://localhost:4200
npm run build      # produkcijski build u dist/
```

## Demo za klijenta – GitHub Pages

Adresa: **https://tsimunic.github.io/mcz-web/**

Jednokratno: na GitHubu u repozitoriju **Settings → Pages → Build and deployment → Source:
"GitHub Actions"**. Nakon toga svaki `git push` na `main` sam napravi build i objavi stranicu
(`.github/workflows/deploy-pages.yml`, traje 2–4 minute; napredak je u kartici **Actions**).

`npm run build:demo` radi isto lokalno:

- gradi za podadresu `/mcz-web/` (konfiguracija `demo` u `angular.json`);
- koristi `src/environments/environment.demo.ts`: pregled linka pokazuje na demo adresu, a sve
  stranice imaju `noindex`, da se demo ne pojavi u Googleu umjesto prave stranice;
- napravi `404.html` (`scripts/github-pages.mjs`), da izravni link na košaricu, blagajnu ili
  potvrdu narudžbe radi i na GitHub Pagesu.

Za klijenta: obrasci (kontakt, servis, narudžba) još ništa ne šalju, pravne stranice čekaju
tekst, a slike se učitavaju sa stare stranice.

## Objava (statički hosting)

`npm run build` unaprijed generira HTML za naslovnicu, trgovinu, sve kategorije, sve proizvode,
servis, kontakt i pravne stranice (`src/app/app.routes.server.ts`). Na hosting se kopira sadržaj
mape `dist/moto-centar-zagorje/browser/` – Node poslužitelj nije potreban.

Hosting mora:

1. za `/proizvod/neki-slug` vratiti `/proizvod/neki-slug/index.html` (većina hostinga to radi sama);
2. za sve ostalo (košarica, blagajna, nepostojeće stranice) vratiti **`index.csr.html`** sa statusom 200.

| Hosting | Postavka za točku 2 |
|---|---|
| Apache / cPanel (`.htaccess`) | `FallbackResource /index.csr.html` |
| Nginx | `try_files $uri $uri/index.html /index.csr.html;` |
| Netlify (`_redirects`) | `/*  /index.csr.html  200` |

Novi proizvod mora proći kroz `npm run build` da bi dobio svoj HTML (i pregled linka na WhatsAppu).

## Ikone i pregled linka

| Datoteka (`public/`) | Gdje se vidi |
|---|---|
| `favicon.ico` (16/32/48) | kartica preglednika |
| `icon-192.png`, `icon-512.png` | Google rezultati, Android, instalacija na početni zaslon |
| `icon-maskable-512.png` | Android ikona izrezana u krug (logo u sigurnoj zoni) |
| `apple-touch-icon.png` (180, bijela podloga) | iPhone/iPad "Dodaj na početni zaslon" |
| `site.webmanifest` | naziv "MCZ", boje, ikone za Android |
| `og-image.jpg` (1200×630) | pregled linka na WhatsAppu, Facebooku, Viberu, LinkedInu, X-u |

Naslov, opis, kanonsku adresu i oznake za dijeljenje postavlja `core/services/seo.service.ts`:
proizvod koristi svoju fotografiju, naziv, cijenu i dostupnost, a ostale stranice `og-image.jpg`.
Košarica, blagajna i 404 imaju `noindex`. Domena je u `SITE.url` (`site.ts`).

Nakon objave provjerite pregled linka u [Facebook Sharing Debuggeru](https://developers.facebook.com/tools/debug/)
(WhatsApp koristi isti pregled; gumb "Scrape Again" osvježi stari pregled iz predmemorije).

## Stranice

| Ruta | Što je |
|---|---|
| `/` | Naslovnica: hero (Linhai ATV 110, podcast Pod gasom), ponuda, izdvojeni proizvodi, servis, brendovi, kontakt |
| `/servis` | Usluge, postupak i obrazac za dogovor termina |
| `/kontakt` | Kontakt podaci, obrazac, radno vrijeme, karta (učitava se na klik). `?upit=Naziv` popuni poruku |
| `/trgovina`, `/trgovina/:kategorija` | Popis proizvoda: stablo kategorija, pretraga, cijena, dostupnost, sortiranje, stranice |
| `/proizvod/:slug` | Galerija, cijena, količina, opis, specifikacije, povezani proizvodi |
| `/kosarica` | Košarica (čuva se u localStorageu) |
| `/blagajna` | Kontakt, dostava, plaćanje, sažetak |
| `/narudzba/:broj` | Potvrda narudžbe |
| `/politika-privatnosti`, `/opci-uvjeti` | Pravne stranice (tekst treba upisati) |

## Gdje se što mijenja

```
src/app/core/data/site.ts          ← telefon, e-mail, adresa, radno vrijeme, društvene mreže
src/app/core/data/products.data.ts ← PROIZVODI (privremeni podaci)
src/app/core/data/categories.data.ts ← stablo kategorija
src/app/core/data/shop-config.ts   ← načini dostave i plaćanja, broj proizvoda po stranici
src/app/pages/legal/legal.ts       ← tekst politike privatnosti i općih uvjeta
src/styles.scss                    ← dizajn sustav (boje, tipografija, gumbi, obrasci)
```

## Što je simulacija (treba spojiti)

- **Narudžbe** – `core/services/order.service.ts` → `placeOrder()` trenutno ništa ne šalje.
- **Kontakt i servis obrasci** – `core/services/contact.service.ts` → `send()` samo ispisuje u konzolu.
- **Proizvodi** – `core/services/product.service.ts` čita `products.data.ts`. Za API zamijenite
  `signal(PRODUCTS)` s `httpResource(...)` – ostatak aplikacije ostaje isti.
- **Kartično plaćanje** – u `shop-config.ts` označeno kao "uskoro".

## Slike

Slike se trenutno učitavaju s postojeće stranice (`UPLOADS` u `site.ts`). Prije objave ih prebacite
u `public/` i promijenite tu putanju.

Proizvodi koriste **originalne** fotografije, ne WordPress sličice `-500x500`: WordPress ih reže na
kvadrat iz sredine, pa vozilima s pravokutnih fotki odreže retrovizore i kotače. Kartica prikazuje
cijelu sliku (`object-fit: contain`). Iznimka je `1000l-landforce-green…` (original je PNG od 718 KB,
pa kartica koristi verziju `-768x512`). Pri prebacivanju u `public/` slike treba smanjiti na ~1200 px
i spremiti kao WebP.

## Dizajn

- Boje iz loga: topla crna `#16120f`, MCZ narančasta `#e24d25`, topla siva `#8f8a81`, krem `#dbd4c7`.
  Narančasta je samo za akcije i jedan naglasak po ekranu. Gumbi s bijelim tekstom koriste
  dublju nijansu `#d2441e` (kontrast 4,6 : 1); `#e24d25` je za naglaske na tamnoj podlozi.
- Slike proizvoda stoje na toploj sivoj podlozi (`mix-blend-mode: multiply`), pa bijela pozadina
  studijskih fotki nestaje i mreža izgleda ujednačeno.
- Kartice prikazuju kratki naziv i oznake (4×4, EPS, T3b…) – logika je u `core/utils/product-display.ts`.
- Logotipi brendova: `BRAND_LOGOS` u `core/data/categories.data.ts` (Hisun nema logo, prikazuje se naziv).
- Mobitel (do 600 px): rub od 20 px (`--gutter`); bijeli paneli s obrascima, košarica, blagajna i
  glavna slika proizvoda idu od ruba do ruba, pa je tekst poravnat s ostatkom stranice; gumbi
  jedan ispod drugog su pune širine; filteri po brendu i sličice proizvoda su jedan red koji se
  pomiče prstom; dodirne mete najmanje 44 px. Provjereno na 320, 375 px i na računalu.
- Font: Archivo (varijabilna širina – uski rez za naslove)
- Motiv: topografske izohipse (`shared/contours`) – teren i zagorski bregi
