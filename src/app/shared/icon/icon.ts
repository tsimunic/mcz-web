import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

const rect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

const ICONS = {
  phone: ['M5 4h3.2l1.8 4.6-2.3 1.5a11.5 11.5 0 0 0 6.2 6.2l1.5-2.3L20 15.8V19a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3 6.1 2 2 0 0 1 5 4z'],
  mail: [rect(3, 5, 18, 14, 2), 'm3.5 7 8.5 6 8.5-6'],
  pin: ['M12 21.5s-7-5.6-7-11.3a7 7 0 0 1 14 0c0 5.7-7 11.3-7 11.3z', circle(12, 10, 2.6)],
  clock: [circle(12, 12, 9), 'M12 7.5V12l3 2'],
  cart: ['M2.5 4h2.6l2.3 10.6a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.5-1.2L21 8H6', circle(10, 20, 1.2), circle(17.5, 20, 1.2)],
  search: [circle(10.5, 10.5, 6.5), 'm20 20-4.8-4.8'],
  menu: ['M4 7h16M4 12h16M4 17h16'],
  close: ['M6 6l12 12M18 6 6 18'],
  'chevron-right': ['m9 5.5 6.5 6.5L9 18.5'],
  'chevron-left': ['M15 5.5 8.5 12l6.5 6.5'],
  'chevron-down': ['m5.5 9 6.5 6.5L18.5 9'],
  plus: ['M12 5v14M5 12h14'],
  minus: ['M5 12h14'],
  trash: ['M4 7h16M10 11v6M14 11v6M6 7l1 12.2A2 2 0 0 0 9 21h6a2 2 0 0 0 2-1.8L18 7M9 7V4h6v3'],
  shield: ['M12 3 4.5 6v5.5c0 4.8 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.7 7.5-9.5V6L12 3z', 'm8.8 12 2.2 2.2 4.3-4.4'],
  award: [circle(12, 9, 5.5), 'm8.6 13.4-1.6 7.6 5-2.6 5 2.6-1.6-7.6'],
  truck: ['M2.5 6h11v10h-11zM13.5 9.5h4.2l3.3 3.4V16h-7.5', circle(6.5, 17.5, 1.8), circle(17, 17.5, 1.8)],
  wrench: ['M14.7 6.3a4.5 4.5 0 0 0 5.5 5.6l-8.9 8.9a2.1 2.1 0 0 1-3-3l8.9-8.9a4.5 4.5 0 0 0-5.6-5.5l3 3-.4 2.5-2.5.4z'],
  check: ['m4.5 12.5 5 5L19.5 7'],
  calendar: [rect(3.5, 5, 17, 15.5, 2), 'M3.5 10h17M8 3v4M16 3v4'],
  box: ['M3.5 7.5 12 3.2l8.5 4.3v9L12 20.8l-8.5-4.3z', 'm3.5 7.5 8.5 4.3 8.5-4.3M12 11.8v9'],
  filter: ['M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1', circle(15, 6, 2), circle(9, 12, 2), circle(17, 18, 2)],
  play: ['M8 5.5v13l10.5-6.5z'],
  pause: ['M9 5.5v13M15 5.5v13'],
  'external': ['M14 4h6v6M20 4l-9 9M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10'],
  facebook: ['M14 8.5h2.5V5H14a4 4 0 0 0-4 4v2.5H7.5V15H10v6h3.5v-6H16l.6-3.5h-3.1V9a.5.5 0 0 1 .5-.5z'],
  instagram: [rect(3.5, 3.5, 17, 17, 5), circle(12, 12, 4), circle(17.2, 6.8, 0.4)],
  youtube: [rect(2.5, 5.5, 19, 13, 4), 'M10 9.3v5.4l4.6-2.7z'],
  user: [circle(12, 8, 4), 'M4.5 20.5a7.5 7.5 0 0 1 15 0'],
  info: [circle(12, 12, 9), 'M12 11v5.5M12 7.8v.2'],
} satisfies Record<string, string[]>;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    @for (d of paths(); track $index) {
      <path [attr.d]="d" />
    }
  </svg>`,
  styles: `
    :host {
      display: inline-block;
      width: 1.25em;
      height: 1.25em;
      flex: none;
      line-height: 0;
    }
    svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: var(--icon-stroke, 1.75);
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  protected readonly paths = computed(() => ICONS[this.name()]);
}
