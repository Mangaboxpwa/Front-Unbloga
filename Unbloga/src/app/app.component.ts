import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SwUpdate,VersionReadyEvent  } from '@angular/service-worker';
import { AlertController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { NotificationsService } from './core/services/notifications.service';
import { CookieService } from 'ngx-cookie-service';
import { Auth } from './core/services/auth';
import { timeout } from 'rxjs';
import { PushServiceTs } from './core/push.service.ts';
import { HttpClient } from '@angular/common/http';
import { App } from '@capacitor/app';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private router:Router,
    private swUpdate: SwUpdate,
    private alertController: AlertController,
    private notify: NotificationsService,
    private cookies:CookieService,
    private authService:Auth,
    private pushService: PushServiceTs,
    private http: HttpClient,
    private navigation:NavigationService
  ) {
    this.listenForUpdates();
  }

  listenForUpdates() {
    if (!this.swUpdate.isEnabled){
      console.log('returnListenForUpdates') 
      return;
      }
      console.log('si ListenForUpdates')

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
  ngOnInit() {
    if (this.cookies.get('token')){
      this.me()
    }
    App.addListener('backButton',({canGoBack})=>{
      if (canGoBack){
        this.goBack()
      }
    })
  }
  me(){
      this.authService.me().pipe(
        timeout(50000)
      ).subscribe(
        (response) => {
          console.log(response)
          if (response.data){
            const userId = response.data.id; 
            this.notify.initEcho();
            this.notify.listenToBanEvents(userId)
            this.notify.listenToFollowerEvents(userId);
          }
        }, error => {
          console.log(error)
          if (error.name == "TimeOutError") {
            this.me()
          }
        }
      )
    }
    goBack() {
  if (this.navigation.canGoBack()) {
    this.navigation.pop()
  } else {
    this.router.navigate(['/tab3']);
  }
}
}
