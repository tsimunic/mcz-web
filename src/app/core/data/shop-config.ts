import { PaymentMethod, ShippingMethod } from '../models/product.model';

/** Načini dostave i plaćanja na blagajni – prilagodite cijene i opise. */

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'pickup',
    label: 'Osobno preuzimanje',
    description: 'U poslovnici u Bedekovčini, u radno vrijeme.',
    price: 0,
    requiresAddress: false,
  },
  {
    id: 'delivery',
    label: 'Dostava na adresu',
    description: 'Trošak dostave javljamo prije slanja, ovisno o veličini pošiljke.',
    price: null,
    requiresAddress: true,
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'bank',
    label: 'Bankovna uplata',
    description: 'Podatke za uplatu šaljemo e-mailom nakon potvrde narudžbe.',
  },
  {
    id: 'cod',
    label: 'Plaćanje pouzećem',
    description: 'Plaćate dostavljaču pri preuzimanju paketa.',
    onlyFor: ['delivery'],
  },
  {
    id: 'store',
    label: 'Plaćanje u poslovnici',
    description: 'Gotovinom ili karticom pri preuzimanju.',
    onlyFor: ['pickup'],
  },
  {
    id: 'card',
    label: 'Kartično plaćanje online',
    description: 'Uskoro dostupno.',
    disabled: true,
  },
];

export const PAGE_SIZE = 12;
