import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { Observable } from 'rxjs'; // Necesario para el casting de tipo

// Interfaz para definir la estructura del payload que esperas del backend
interface NotificationContent {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  vibrate?: number[];
  data?: { url: string };
}

// Define la estructura anidada que viene dentro de 'data'
interface PushDataWrapper {
  notification: NotificationContent;
}

// Define el Payload que realmente sale del Observable
interface PushPayload {
  data: PushDataWrapper; // 👈 La clave 'data' es obligatoria
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

      // 1. Acceder al objeto 'notification' a través de 'data'
      const notification = receivedPayload.data?.notification;

      // 2. Verificar que el objeto existe antes de intentar leer propiedades
      if (!notification) {
        console.error("Payload anidado no encontrado en receivedPayload.data.notification");
        return;
      }

      console.log('Push recibido con la app abierta (desanidado):', notification.title);

      // 3. Lógica para mostrar la notificación nativa
      if (Notification.permission === 'granted') {
        // Usar las propiedades del objeto 'notification'
        new Notification(notification.title, {
          body: notification.body,
          icon: notification.icon || '/assets/icon/default.png',
          tag: notification.tag,
          data: notification.data // Pasa los datos de navegación
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