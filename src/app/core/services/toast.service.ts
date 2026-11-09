import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  title: string;
  text?: string;
  image?: string;
  action?: { label: string; link: string };
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  readonly toasts = signal<Toast[]>([]);

  show(toast: Omit<Toast, 'id'>, duration = 4500): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list.slice(-2), { ...toast, id }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }
}
