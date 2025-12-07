import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PushServiceTs {

  // Suscribirse a notificaciones
  async subscribeUserToPush(): Promise<PushSubscription | null> {
    if (!('serviceWorker' in navigator)) return null;
    const reg = await navigator.serviceWorker.ready;

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: this.urlBase64ToUint8Array(
        "BP4H2FByaup-wOJWBvqXUWLiSlmb3YfucoVcTc_3BRutFKqcjIjLZzeXOreHx8I4bJ6Q0E42bWb0zEKtU-txohk" // aquí tu VAPID_PUBLIC_KEY
      )
    });
    console.log(sub);
    return sub;
  }

  // Helper para convertir Base64 a Uint8Array
  private urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
  }
}
