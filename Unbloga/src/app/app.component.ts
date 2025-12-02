import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SwUpdate } from '@angular/service-worker';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private swUpdate: SwUpdate,
    private alertController: AlertController
  ) {
    this.listenForUpdates();
  }

  listenForUpdates() {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates.subscribe(async () => {
      const alert = await this.alertController.create({
        header: 'Actualización disponible',
        message: 'Hay una nueva versión de la aplicación. ¿Deseas actualizar?',
        buttons: [
          {
            text: 'Ahora no',
            role: 'cancel',
          },
          {
            text: 'Actualizar',
            handler: () => {
              window.location.reload();
            },
          },
        ],
      });

      await alert.present();
    });
  }
}
