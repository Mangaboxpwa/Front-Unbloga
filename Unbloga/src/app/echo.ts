import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';

(window as any).Pusher = Pusher;
(Pusher as any).logToConsole = true;

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

  // Authorizer temporal (solo hasta que se llame setEchoAuthorizer)
  authorizer: (_channel) => ({
    authorize: (_socketId: any, callback: any) => {
      callback(true, {}); // fuerza a usar token real
    },
  }),
});

// Función para actualizar el authorizer con el token JWT
export const setEchoAuthorizer = (token: string) => {
  echo.options.authorizer = (channel: any) => ({
    authorize: (socketId: string, callback: (err: any, authData: any) => void) => {
      fetch(environment.apiUrlBase + 'broadcasting/auth', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          socket_id: socketId,
          channel_name: channel.name,
        }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Auth failed');
          return res.json();
        })
        .then(data => {
          callback(null, data); // ✅ Correcto
        })
        .catch(err => {
          console.error('Error auth channel:', err);
          callback(err, null); // ❌ Primer parámetro = error
        });
    },
  });
};
