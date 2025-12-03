import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { createEcho } from 'src/app/echo';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private echo: any;

  constructor(private cookie: CookieService) {}

  initEcho() {
    const token = this.cookie.get('token');
    if (token) {
      this.echo = createEcho(token);
      console.log('Echo inicializado con token.');
    } else {
      console.warn('No se encontró token para inicializar Echo.');
    }
  }

  listenToFollowerEvents(userId: number) {
    this.echo.private(`user.${userId}`)
      .listen('.NewFollower', (data: any) => {
        console.log('EVENTO RECIBIDO:', data);
        this.sendNotification(data);
      })
      .error((err: any) => console.error('Error al suscribirse al canal:', err));
  }

  sendNotification(data: any) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification('Nuevo seguidor', {
          body: `${data.follower.name} te ha seguido`,
          icon: '/assets/icon/icon.png',
        });
      });
    }
  }

  /**
   * Solicita permiso para notificaciones si no está concedido
   */
  requestPermission() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        console.log("Permiso de notificación:", permission);
      });
    }
  }
}
