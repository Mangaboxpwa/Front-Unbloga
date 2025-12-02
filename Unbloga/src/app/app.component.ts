import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SwUpdate,VersionReadyEvent  } from '@angular/service-worker';
import { AlertController } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private swUpdate: SwUpdate,
    private alertController: AlertController,
  ) {
    this.listenForUpdates();
  }

  listenForUpdates() {
    if (!this.swUpdate.isEnabled) return;

    this.swUpdate.versionUpdates
      .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
      .subscribe(async () => {
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
                // Aquí SÍ forzamos la nueva versión SIN loop
                this.swUpdate.activateUpdate().then(() => {
                  document.location.reload();
                });
              },
            },
          ],
        });

        await alert.present();
      });
  }
}
