import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';

@Injectable({
  providedIn: 'root',
})
export class PushServiceTs {
  readonly VAPID_PUBLIC_KEY = 'BP4H2FByaup-wOJWBvqXUWLiSlmb3YfucoVcTc_3BRutFKqcjIjLZzeXOreHx8I4bJ6Q0E42bWb0zEKtU-txohk';

  constructor(private swPush: SwPush) {
    this.swPush.messages.subscribe(payload => {
      console.log('Push recibido con la app abierta:', payload);
    });

    this.swPush.notificationClicks.subscribe(event => {
      console.log('Notificación clicada:', event);
    });
  }

  // 3. Método de suscripción usando SwPush
  async subscribeUserToPush(): Promise<PushSubscription | null> {
    if (!this.swPush.isEnabled) {
      console.warn('El Service Worker o Push no están habilitados.');
      return null;
    }

    try {
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      });

      console.log('Suscripción generada con SwPush:', sub);

      return sub;
    } catch (err) {
      console.error('No se pudo suscribir al usuario:', err);
      return null;
    }
  }
}