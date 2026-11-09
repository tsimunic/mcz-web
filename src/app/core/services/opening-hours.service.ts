import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { OPENING_HOURS } from '../data/site';

export interface OpenStatus {
  open: boolean;
  label: string;
  /** 0 = ponedjeljak */
  todayIndex: number;
}

/** Računa "otvoreno / zatvoreno" prema vremenu u Hrvatskoj, osvježava se svake minute. */
@Injectable({ providedIn: 'root' })
export class OpeningHoursService {
  readonly status = signal<OpenStatus>(computeStatus(new Date()));

  constructor() {
    const timer = setInterval(() => this.status.set(computeStatus(new Date())), 60_000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }
}

function zagrebNow(date: Date): { dayIndex: number; minutes: number } {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Zagreb',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return { dayIndex: days.indexOf(get('weekday')), minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const toMin = (hhmm: string) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5));

export function computeStatus(date: Date): OpenStatus {
  const { dayIndex, minutes } = zagrebNow(date);
  const today = OPENING_HOURS[dayIndex];

  if (today.open && today.close) {
    if (minutes >= toMin(today.open) && minutes < toMin(today.close)) {
      return { open: true, label: `Otvoreno do ${today.close}`, todayIndex: dayIndex };
    }
    if (minutes < toMin(today.open)) {
      return { open: false, label: `Zatvoreno, otvaramo danas u ${today.open}`, todayIndex: dayIndex };
    }
  }

  for (let step = 1; step <= 7; step++) {
    const idx = (dayIndex + step) % 7;
    const day = OPENING_HOURS[idx];
    if (day.open) {
      const when = step === 1 ? 'sutra' : `u ${day.dayAcc}`;
      return { open: false, label: `Zatvoreno, otvaramo ${when} u ${day.open}`, todayIndex: dayIndex };
    }
  }
  return { open: false, label: 'Zatvoreno', todayIndex: dayIndex };
}
