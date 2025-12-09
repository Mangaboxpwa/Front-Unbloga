import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Observable } from 'rxjs'; // Necesario para el casting de tipo

// Interfaz para definir la estructura del payload que esperas del backend
interface PushNotificationContent {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  data?: { url: string }; // Estructura de navegación que envías desde Laravel
}

// Interfaz del Payload que realmente recibes de SwPush
interface PushPayload {
  notification: PushNotificationContent;
  // Si envías datos silenciosos fuera de 'notification', irían aquí:
  // data?: any; 
}

@Injectable({
  providedIn: 'root',
})
export class PushServiceTs {
  // 1. Asegúrate de que esta clave VAPID esté definida
  readonly VAPID_PUBLIC_KEY = 'BP4H2FByaup-wOJWBvqXUWLiSlmb3YfucoVcTc_3BRutFKqcjIjLZzeXOreHx8I4bJ6Q0E42bWb0zEKtU-txohk';

  constructor(private swPush: SwPush) {

    // 2. Solución para el error de tipado: Casting el Observable a PushPayload
    (this.swPush.messages as Observable<PushPayload>).subscribe(receivedPayload => {

      const notification = receivedPayload.notification;
      console.log('Push recibido con la app abierta:', receivedPayload);

      // Lógica para mostrar la notificación nativa si la app está enfocada/abierta
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/assets/icon/default.png',
          tag: notification.tag,
          // Pasar la URL de navegación a la notificación nativa
          data: notification.data
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