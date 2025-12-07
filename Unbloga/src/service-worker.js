self.addEventListener('push', function (event) {
    const data = event.data ? event.data.json() : {};

    const title = data.title || "Notificación";
    const options = {
        body: data.body || "",
        icon: "/assets/icon/icon.png",
        vibrate: [200, 100, 200],
        data: data,
    };

    console.log(data)
    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
