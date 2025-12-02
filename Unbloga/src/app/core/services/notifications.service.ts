import { Injectable } from '@angular/core';
import { echo } from 'src/app/echo';

@Injectable({ providedIn: 'root' })
export class NotificationsService {

  listenToFollowerEvents(userId: number) {
    console.log('Escuchando canal user.' + userId);

    echo.private(`user.${userId}`)
      .listen('NewFollower', (data: any) => {
        console.log('EVENTO RECIBIDO:', data);

        // Notificar al Service Worker
        this.sendNotification(data);
      });
  }

  sendNotification(data: any) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(reg => {
        reg.showNotification(
          'Nuevo seguidor',
          {
            body: `${data.follower.name} te ha seguido`,
            icon: '/assets/icon/icon.png'
          }
        );
      });
    }
  }
}
