import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRefresher, RefresherCustomEvent, IonRefresherContent, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonButton, IonIcon } from '@ionic/angular/standalone';
import { QRCodeComponent } from 'angularx-qrcode';
import { ActivatedRoute } from '@angular/router';
import { UserMe } from 'src/app/core/interfaces/user_me';
import { UserService } from 'src/app/core/services/user.service';
import { timeout } from 'rxjs';
import { NavController } from '@ionic/angular';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { Router } from '@angular/router';
import { arrowBackOutline, push } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonButtons, IonRefresher, IonRefresherContent, QRCodeComponent, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class QrCodePage implements OnInit {
  id = 0
  User?:UserMe
  public myAngularxQrCode: string = '';
  constructor(private router:Router, private navigation:NavigationService,private navCtrl: NavController,private route: ActivatedRoute, private userService:UserService) { 
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.userInfo()
    this.myAngularxQrCode = 'https://igmarapruebameporfavor.site/user-profile/'+this.id
  }
goBack() {
  if (this.navigation.canGoBack()) {
    this.navigation.back();
  } else {
    this.router.navigate(['/tab1']);
  }
}
  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.ngOnInit()
      event.target.complete();
    }, 2000);
  }

userInfo(){
  console.log('entra')
  this.userService.userInfo(this.id).pipe(
        timeout(50000)
      ).subscribe(
        (response) => {
          console.log(response)
          if (response.data){
            this.User = response.data
          }
          
        }, error => {
          console.log(error)
          if (error.name == "TimeOutError") {
            //this.indexMangas()
          }
        }
      )
}

}
