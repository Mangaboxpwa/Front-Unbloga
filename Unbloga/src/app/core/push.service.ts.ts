import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Observable } from 'rxjs'; // Necesario para el casting de tipo

// Interfaz para definir la estructura del payload que esperas del backend
interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  // Puedes agregar aquí más propiedades si tu backend las envía en la clave 'data'
  // Por ejemplo: url?: string; 
}

@Injectable({
  providedIn: 'root',
})
export class PushServiceTs {
  // 1. Asegúrate de que esta clave VAPID esté definida
  readonly VAPID_PUBLIC_KEY = 'BP4H2FByaup-wOJWBvqXUWLiSlmb3YfucoVcTc_3BRutFKqcjIjLZzeXOreHx8I4bJ6Q0E42bWb0zEKtU-txohk';

  constructor(private swPush: SwPush) {

    // 2. Solución para el error de tipado: Casting el Observable a PushPayload
    (this.swPush.messages as Observable<PushPayload>).subscribe(payload => {

      console.log('Push recibido con la app abierta:', payload);

      // Lógica para mostrar la notificación nativa si la app está enfocada/abierta
      if (Notification.permission === 'granted') {
        new Notification(payload.title, {
          body: payload.body,
          // Usa payload.icon si viene del backend, si no, usa un default.
          icon: payload.icon || '/assets/icon/default.png',
          tag: payload.tag
        });
      }
    });

    // 3. Manejo de clicks en notificaciones
    this.swPush.notificationClicks.subscribe(event => {
      console.log('Notificación clicada:', event);
      // Aquí implementarías la lógica de navegación (ej. this.router.navigate([event.notification.data.url]))
    });
  }

  /**
   * Solicita el permiso y la suscripción al Service Worker activo.
   * @returns La suscripción para enviar al backend.
   */
  async subscribeUserToPush(): Promise<PushSubscription | null> {
    if (!this.swPush.isEnabled) {
      console.warn('El Service Worker o Push no están habilitados.');
      return null;
    }

    try {
      // SwPush se comunica con ngsw-worker.js para obtener la suscripción
      const sub = await this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      });

      console.log('Suscripción generada con SwPush:', sub);

      return sub; // El componente que llama enviará esto al backend
    } catch (err) {
      console.error('No se pudo suscribir al usuario:', err);
      return null;
    }
  }
}