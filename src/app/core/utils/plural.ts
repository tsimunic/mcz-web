/** Hrvatska množina: plural(3, ['proizvod', 'proizvoda', 'proizvoda']) → "proizvoda" */
export function plural(n: number, forms: [one: string, few: string, many: string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export const PRODUCT_FORMS: [string, string, string] = ['proizvod', 'proizvoda', 'proizvoda'];

/** Iz WordPress sličice ("-500x500.webp", "-768x512.png") izvodi original; za URL bez dimenzija vraća isti URL */
export function fullSize(url: string): string {
  return url.replace(/-\d+x\d+(?=\.(webp|png|jpe?g)$)/i, '');
}
