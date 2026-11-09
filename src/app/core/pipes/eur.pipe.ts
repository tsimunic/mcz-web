import { Pipe, PipeTransform } from '@angular/core';

const fmt = new Intl.NumberFormat('hr-HR', { style: 'currency', currency: 'EUR' });

/** 4490 → "4.490,00 €" */
@Pipe({ name: 'eur' })
export class EurPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return value == null ? '' : fmt.format(value);
  }
}
