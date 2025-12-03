import { Injectable } from '@angular/core';
import { echo, setEchoAuthorizer } from 'src/app/echo';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  constructor(private cookie: CookieService) {}

  /**
   * Inicializa Echo con el token actual.
   * Debe llamarse antes de suscribirse a cualquier canal privado.
   */
  initEcho() {
    const token = this.cookie.get('token');
    if (token) {
      setEchoAuthorizer(token);
      console.log('Echo inicializado con token.');
    } else {
      console.warn('No se encontró token para inicializar Echo.');
    }
  }

  /**
   * Suscribirse a eventos de nuevos seguidores del usuario
   */
  listenToFollowerEvents(userId: number) {
    console.log('Escuchando canal privado user.' + userId);

    echo.private(`user.${userId}`)
      .listen('.NewFollower', (data: any) => { // ⚠️ punto antes del evento
        console.log('EVENTO RECIBIDO:', data);
        this.sendNotification(data);
      })
      .error((err: any) => {
        console.error('Error al suscribirse al canal:', err);
      });
  }

  /**
   * Mostrar notificación push en el navegador
   */
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
