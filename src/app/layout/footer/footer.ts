import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SITE } from '../../core/data/site';
import { Contours, Hill } from '../../shared/contours/contours';
import { Hours } from '../../shared/hours/hours';
import { Icon } from '../../shared/icon/icon';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, Contours, Hours, Icon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  protected readonly site = SITE;
  protected readonly year = new Date().getFullYear();
  protected readonly hills: Hill[] = [
    { x: 0.08, y: 1.15, rings: 34, gap: 30, seed: 3, squash: 0.75 },
    { x: 1.05, y: -0.25, rings: 18, gap: 28, seed: 21, squash: 0.7 },
  ];

  protected readonly shopLinks = [
    { label: 'Vozila', slug: 'vozila' },
    { label: 'Dijelovi', slug: 'dijelovi' },
    { label: 'Servis kitovi', slug: 'service-kit' },
    { label: 'Dodatna oprema', slug: 'dodatna-oprema' },
    { label: 'Posebna ponuda', slug: 'posebna-ponuda' },
  ];
}
