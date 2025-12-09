self.addEventListener('push', function (event) {
    const data = event.data ? event.data.json() : {};

    console.log("Payload recibido:", data); // Esto te mostrará lo que llega

    const title = data.title || "Notificación";
    const options = {
        body: data.body || "",
        icon: "/assets/icon/icon.png",
        vibrate: [200, 100, 200],
        data: data,
    };

    console.log('Evento push:', event);
    console.log('event.data:', event.data);

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
