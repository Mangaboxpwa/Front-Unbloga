import { Component,ViewChild,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RefresherCustomEvent,IonRefresher, IonRefresherContent, IonButtons, IonBadge, IonCol,IonRow,IonCard,IonItem,IonList,IonLabel,IonAvatar,IonImg,IonButton,IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonToast, IonActionSheet } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../core/services/auth';
import { ReviewService } from '../core/services/review.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { timeout } from 'rxjs';
import { UserMe } from '../core/interfaces/user_me';
import { ReviewsFromUser } from '../core/interfaces/ReviewsFromUser';
import { ViewDidEnter } from '@ionic/angular';

Chart.register(...registerables);


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonRefresher, IonRefresherContent,IonActionSheet, IonToast, IonButtons, IonBadge, RouterLink,IonCol,IonRow,IonCard,IonItem,IonList,IonLabel,IonAvatar,CommonModule,IonButton,IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Tab3Page implements ViewDidEnter {
  @ViewChild('barCanvas') private barCanvas!: ElementRef;
  private barChart!: Chart;
  User?:UserMe
  Reviews?:ReviewsFromUser[]
  Favorites?:ReviewsFromUser[]
  toolbar = false
  public actionSheetButtons = [
    {
      text: 'Ver código QR',
      handler:()=>this.qr(),
      data: {
        action: 'QR',
      },
    },
    {
      text: 'Compartir',
      handler:()=>this.compartir(),
      id:"open-toast",
      data: {
        action: 'share',
      },
    },
    {
      text: 'Cerrar',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];
constructor(private reviewService:ReviewService, private router: Router, private auth: Auth) {
}
  ionViewDidEnter(): void {
    this.ngOnInit()
  }

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  if (this.auth.isLoggedIn()){
    this.toolbar = true
    this.me()
    this.index()
    this.favorites()
  }
}

get isLoggedIn(): boolean {
  return this.auth.isLoggedIn();
}

  goLogin() {
    this.router.navigate(['/login']);
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/tabs/tab3']);
  }

  me(){
    this.auth.me().pipe(
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
          this.me()
        }
      }
    )
  }
  index(){
    this.reviewService.index().pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          this.Reviews = response.data
        }
      }, error => {
        console.log(error)
        if (error.name == "TimeOutError") {
          this.index()
        }
      }
    )
  }
  favorites(){
    this.reviewService.favorite().pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          this.Favorites = response.data
        }
      }, error => {
        console.log(error)
        if (error.name == "TimeOutError") {
          this.favorites()
        }
      }
    )
  }
compartir(){
    const url ="https://igmarapruebameporfavor.site/user-profile/"+this.User?.id;
    navigator.clipboard.writeText(url).then(() => {  
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  
}
qr(){
  this.router.navigate(['/qr-code/'+this.User?.id]);
}
handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.ngOnInit()
      event.target.complete();
    }, 2000);
  }
}
