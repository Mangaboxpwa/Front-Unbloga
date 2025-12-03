import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';

export const createEcho = (token: string) => {
  return new Echo({
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
        authorize: (socketId: string, callback: any) => {
          fetch(environment.apiUrlBase + 'broadcasting/auth', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              socket_id: socketId,
              channel_name: channel.name
            }),
          })
            .then(async res => {
              if (!res.ok) throw new Error('HTTP ' + res.status);
              return res.json();
            })
            .then(data => callback(null, data))
            .catch(err => callback(err, { auth: "" }));
        }
      };
    }
  });
};
