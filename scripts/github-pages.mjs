// Završni korak za GitHub Pages (pokreće ga `npm run build:demo`).
//
// GitHub Pages ne zna preusmjeriti nepostojeću adresu na aplikaciju, nego vraća 404.html.
// Zato u 404.html stavljamo klijentsku verziju aplikacije (index.csr.html): izravan link ili
// osvježavanje košarice, blagajne, potvrde narudžbe i nepostojećih stranica tada radi normalno.
import { copyFileSync, existsSync, writeFileSync } from 'node:fs';

const dir = 'dist/moto-centar-zagorje/browser';

if (!existsSync(`${dir}/index.csr.html`)) {
  console.error(`Nema ${dir}/index.csr.html – prvo pokrenite build.`);
  process.exit(1);
}

copyFileSync(`${dir}/index.csr.html`, `${dir}/404.html`);
// Bez Jekylla (važno samo ako se Pages objavljuje iz grane, a ne preko GitHub Actions)
writeFileSync(`${dir}/.nojekyll`, '');

console.log('GitHub Pages: 404.html i .nojekyll spremni u', dir);
