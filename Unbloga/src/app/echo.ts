// echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';

export const echo = new Echo({
  broadcaster: 'pusher',
  key: '557428516c85e0382746',
  cluster: 'us3',
  wsHost: 'ws-us3.pusher.com',
  wsPort: 443,
  wssPort: 443,
  forceTLS: true,
  encrypted: true,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  authorizer: (channel: any) => {
    return {
      authorize: (socketId: any, callback: any) => {
        fetch(environment.apiUrlBase+'broadcasting/auth', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name
          })
        })
          .then(res => res.json())
          .then(data => callback(false, data))
          .catch(error => callback(true, error));
      }
    };
  }
});
