import { Injectable } from '@angular/core';
import { echo, setEchoAuthorizer } from 'src/app/echo';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  constructor(private cookie: CookieService) {}

  // Inicializa Echo con el token actual
  initEcho() {
    const token = this.cookie.get('token');
    if (token) {
      setEchoAuthorizer(token);
    }
  }

  listenToFollowerEvents(userId: number) {
    console.log('Escuchando canal user.' + userId);

    echo.private(`user.${userId}`)
      .listen('NewFollower', (data: any) => {
        console.log('EVENTO RECIBIDO:', data);
        this.sendNotification(data);
      });
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

  requestPermission() {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        console.log("Permiso:", permission);
      });
    }
  }
}
