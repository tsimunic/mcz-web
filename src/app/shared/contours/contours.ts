import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Jedno "brdo" izohipsi. x/y su relativni (0–1) unutar 1600×900 platna, mogu biti i izvan. */
export interface Hill {
  x: number;
  y: number;
  rings: number;
  gap: number;
  seed: number;
  /** spljoštenost po visini (1 = krug) */
  squash?: number;
}

const W = 1600;
const H = 900;

/**
 * Topografske izohipse – motiv terena i zagorskih brega.
 * Svaka peta linija je deblja, kao "glavna izohipsa" na pravim kartama.
 */
@Component({
  selector: 'app-contours',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
    @for (p of paths(); track $index) {
      <path [attr.d]="p.d" [class.idx]="p.index" />
    }
  </svg>`,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      overflow: hidden;
      pointer-events: none;
      color: var(--contour-color, currentColor);
    }
    svg {
      display: block;
      width: 100%;
      height: 100%;
    }
    path {
      fill: none;
      stroke: currentColor;
      stroke-width: 1;
      vector-effect: non-scaling-stroke;
      opacity: var(--contour-opacity, 0.14);
    }
    path.idx {
      stroke-width: 1.8;
      opacity: calc(var(--contour-opacity, 0.14) * 1.7);
    }
  `,
})
export class Contours {
  readonly hills = input<Hill[]>([{ x: 0.2, y: 1.05, rings: 30, gap: 34, seed: 7 }]);

  protected readonly paths = computed(() => this.hills().flatMap((h) => hillPaths(h)));
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hillPaths(h: Hill): { d: string; index: boolean }[] {
  const rand = mulberry32(h.seed);
  const harmonics = [2, 3, 4, 5, 7].map((k) => ({
    k,
    a: (0.17 / k) * (0.45 + rand()),
    p: rand() * Math.PI * 2,
    drift: (rand() - 0.5) * 0.06,
  }));
  const cx = h.x * W;
  const cy = h.y * H;
  const squash = h.squash ?? 0.8;
  const N = 80;
  const out: { d: string; index: boolean }[] = [];

  for (let i = 1; i <= h.rings; i++) {
    const pts: [number, number][] = [];
    for (let j = 0; j < N; j++) {
      const t = (j / N) * Math.PI * 2;
      let m = 0;
      for (const hm of harmonics) m += hm.a * Math.sin(hm.k * t + hm.p + hm.drift * i);
      const r = h.gap * i * (1 + m);
      pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r * squash]);
    }
    out.push({ d: smoothClosed(pts), index: i % 5 === 0 });
  }
  return out;
}

/** Zatvorena Catmull-Rom krivulja kroz točke, kao kubni Bézier */
function smoothClosed(p: [number, number][]): string {
  const n = p.length;
  const f = (v: number) => v.toFixed(1);
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 0; i < n; i++) {
    const p0 = p[(i - 1 + n) % n];
    const p1 = p[i];
    const p2 = p[(i + 1) % n];
    const p3 = p[(i + 2) % n];
    d +=
      `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ` +
      `${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d + 'Z';
}
