import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { environment } from 'src/environments/environment';

console.log("🟥 CARGANDO ECHO CONFIG...");

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

  authorizer: (channel) => {
    console.log("🟦 USANDO AUTHORIZER TEMPORAL EN:", channel.name);
    return {
      authorize: (socketId: any, callback: any) => {
        console.log("🟦 AUTHORIZE TEMPORAL → NO USA TOKEN", {
          channel: channel.name,
          socketId
        });

        callback(true, {}); // ignora auth hasta que setEchoAuthorizer sea aplicado
      }
    };
  }
});

console.log("🟥 ECHO CREADO OK");


// 🚀 Se ejecuta cuando el usuario inicia sesión y existe token
export const setEchoAuthorizer = (token: string) => {
  console.log("🟧 SETEANDO AUTHORIZER REAL CON TOKEN:", token);

  echo.options.authorizer = (channel: any) => {
    console.log("🟨 AUTHORIZER REAL INSTALADO PARA:", channel.name);

    return {
      authorize: (socketId: string, callback: any) => {

        console.log("🟨 INICIANDO AUTH CONTRA BACKEND:", {
          channel: channel.name,
          socketId
        });

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
            console.log("🟦 AUTH RESPONSE STATUS:", res.status);

            if (!res.ok) {
              const errText = await res.text();
              console.error("❌ ERROR AUTH BACKEND RESPONSE:", errText);
              throw new Error('HTTP ' + res.status);
            }

            return res.json();
          })
          .then(data => {
            console.log("✅ AUTH OK (BACKEND):", data);
            callback(null, data);
          })
          .catch(error => {
            console.error("❌ ERROR DURANTE AUTHORIZACION:", error);
            callback(error, { auth: "" });
          });
      }
    };
  };
};
