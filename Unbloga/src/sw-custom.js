// src/ngsw-custom.js

// 1. Lógica de Push (Tu código que sí funciona)
self.addEventListener('push', function (event) {
    // Si el mensaje tiene data (no es silencioso)
    const data = event.data ? event.data.json() : {};

    const title = data.title || "Notificación";
    const options = {
        body: data.body || "",
        icon: "/assets/icon/icon.png",
        vibrate: [200, 100, 200],
        data: data, // Incluir datos extra
    };

    console.log('Push recibido y procesado por custom SW:', data);

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// 2. Manejo de Clicks de Notificación (IMPORTANTE para abrir la app)
self.addEventListener('notificationclick', function (event) {
    console.log('[Service Worker] Notificación clicada: ', event.notification.tag);
    event.notification.close();

    // Reabre o enfoca la ventana de la aplicación.
    event.waitUntil(clients.matchAll({
        type: "window"
    }).then(function (clientList) {
        if (clientList.length > 0) {
            // Si hay ventanas abiertas, enfoca la primera.
            return clientList[0].focus();
        } else {
            // Si no hay ventanas, abre una nueva (reemplaza '/ruta/al/inicio' con tu URL principal)
            return clients.openWindow('/'); 
        }
    }));
});

importScripts('./ngsw-worker.js');