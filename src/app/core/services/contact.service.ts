import { Injectable } from '@angular/core';

export interface ContactMessage {
  name: string;
  phone: string;
  email: string;
  message: string;
  topic?: string;
}

/**
 * Slanje upita (kontakt obrazac, upit za proizvod, narudžba servisa).
 * TRENUTNO SIMULACIJA – spojite na backend, servis za e-mail (npr. Formspree, EmailJS)
 * ili vlastiti API.
 */
@Injectable({ providedIn: 'root' })
export class ContactService {
  async send(message: ContactMessage): Promise<void> {
    // TODO: zamijeniti stvarnim slanjem
    console.info('[ContactService] upit (simulacija):', message);
    await new Promise((r) => setTimeout(r, 600));
  }
}
