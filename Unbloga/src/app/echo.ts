import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { inject } from '@angular/core';

(window as any).Pusher = Pusher; // 🚨 esto hace que Pusher sea global
  const cookie = inject(CookieService);
  let token = cookie.get('token');

export const echo = new Echo({
  broadcaster: 'pusher',
  key: '557428516c85e0382746',
  cluster: 'us3',
  forceTLS: true,
  encrypted: true,
  wsHost: 'ws-us3.pusher.com',
  wsPort: 443,
  wssPort: 443,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  authorizer: (channel: any) => {
    return {
      authorize: (socketId: any, callback: any) => {
        fetch(environment.apiUrlBase + 'broadcasting/auth', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer '+ token,
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name
          })
        })
          .then(res => res.json())
          .then(data => callback(false, data))
          .catch(err => callback(true, err));
      }
    };
  }
});
