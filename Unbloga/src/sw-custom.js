// Instalación del SW personalizado
self.addEventListener('install', event => {
    console.log('[SW-Custom] Instalado');
    self.skipWaiting(); // Activar inmediatamente
});

// Activación del SW
self.addEventListener('activate', event => {
    console.log('[SW-Custom] Activado');
});

// Manejo de push notifications
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};

    console.log('[SW-Custom] Payload recibido:', data);

    const title = data.title || 'Notificación';
    const options = {
        body: data.body || '',
        icon: '/assets/icon/icon.png', // asegúrate que esta ruta exista
        vibrate: [200, 100, 200],
        data: data,
    };

    console.log('[SW-Custom] Evento push:', event);
    console.log('[SW-Custom] event.data:', event.data);

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

// Opcional: abrir URL al click en la notificación
self.addEventListener('notificationclick', event => {
    event.notification.close();

    const url = event.notification.data?.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(clientList => {
                for (const client of clientList) {
                    if (client.url === url && 'focus' in client) return client.focus();
                }
                if (clients.openWindow) return clients.openWindow(url);
            })
    );
});
