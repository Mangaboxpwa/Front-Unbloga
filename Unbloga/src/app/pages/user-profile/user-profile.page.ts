import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RefresherCustomEvent, IonActionSheet, IonButtons, IonBadge, IonCol,IonRow,IonCard,IonItem,IonList,IonLabel,IonAvatar,IonImg,IonButton,IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonToast, IonRefresherContent, IonRefresher, IonBackButton, IonAlert } from '@ionic/angular/standalone';
import { Router, RouterLink,ActivatedRoute } from '@angular/router';
import { timeout } from 'rxjs';
import { ReviewsFromUser } from 'src/app/core/interfaces/ReviewsFromUser';
import { UserMe } from 'src/app/core/interfaces/user_me';
import { Auth } from 'src/app/core/services/auth';
import { ReviewService } from 'src/app/core/services/review.service';
import { UserService } from 'src/app/core/services/user.service';
import { FollowService } from 'src/app/core/services/follows.service';
import { NavController } from '@ionic/angular';
import { OfflineCacheService } from 'src/app/core/services/offline-cache.service';
import { NavigationService } from 'src/app/core/services/navigation.service';
import { arrowBackOutline, push } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [IonIcon, IonAlert, IonRefresher, IonRefresherContent, IonActionSheet, IonToast, IonButtons, FormsModule, CommonModule, IonButton, RouterLink,IonBadge, IonCol,IonRow,IonCard,IonItem,IonLabel,IonAvatar,IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class UserProfilePage implements OnInit {
User?:UserMe
  Reviews?:ReviewsFromUser[]
  Favorites?:ReviewsFromUser[]
  id:number = 0
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
  isAlertOpen = false;
message: any[] = [];
headerAlert = "";
subHeader = "";
btnUndefined = false
alertButtons = [
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
      },
    },
  ];
  constructor(private navigation:NavigationService,private offlineCacheService:OfflineCacheService, private auth:Auth, private navCtrl: NavController,private router:Router, private followService:FollowService, private userService:UserService, private reviewService:ReviewService, private route: ActivatedRoute, private AuthService:Auth) { 
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.id)
    if (this.id > 0){
      this.userInfo()
      this.reviews()
      this.favorites()
    }
  }
goBack() {
  if (this.navigation.canGoBack()) {
    this.navigation.back();
  } else {
    this.router.navigate(['/tab1']);
  }
}
pushUrl(url: string) {
    this.navigation.push(url);
  }
handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.ngOnInit()
      event.target.complete();
    }, 2000);
  }
  irNetwork(){
  if (this.auth.isLoggedIn()){
    this.navigation.push('/network/'+ this.id)
    this.router.navigate(['/network', this.id]);
  }else{
    this.headerAlert = 'Denegado'
        this.subHeader = "Inicia sesión"
        this.message = ['Se necesita iniciar sesión para poder verlos.']
        this.alertButtons = [
          {
            text: 'OK',
            role: 'Cerrar',
            handler:()=>{}
          },
        ];
        this.setOpen(true)
  }
  
  
}
setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
}
get isLoggedIn(): boolean {
  return this.auth.isLoggedIn();
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
            this.offlineCacheService.save('https://api.igmarapruebameporfavor.site/api/user/'+this.id, response.data)
          }
          
        }, async error => {
          console.log(error)
          const dataOffline = await this.offlineCacheService.load(error.url);
          this.User = dataOffline
          if (error.name == "TimeOutError") {
            //this.indexMangas()
          }
        }
      )
}
reviews(){
    this.reviewService.index(this.id).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          this.Reviews = response.data
          this.offlineCacheService.save('https://api.igmarapruebameporfavor.site/api/review/user/'+this.id, response.data)
        }
      }, async error => {
        console.log(error)
        const dataOffline = await this.offlineCacheService.load(error.url);
        this.Reviews = dataOffline
        if (error.name == "TimeOutError") {
          this.reviews()
        }
      }
    )
  }
favorites(){
    this.reviewService.favorite(this.id).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          this.Favorites = response.data
          this.offlineCacheService.save('https://api.igmarapruebameporfavor.site/api/review/favorite/'+this.id, response.data)
        }
      }, async error => {
        console.log(error)
        const dataOffline = await this.offlineCacheService.load(error.url);
        this.Favorites = dataOffline
        if (error.name == "TimeOutError") {
          this.favorites()
        }
      }
    )
}
follow(){
      if(this.User?.id)
        {this.followService.follow(this.User.id).pipe(
        timeout(50000)
        ).subscribe(
        (response) => {
          console.log(response)
          if (response.data){
            if(this.User){
              this.User.is_following = true
            }
            
          }
        }, error => {
          console.log(error)
          if (error.name == "TimeOutError") {
            this.follow()
          }
        }
        )
      }
}
unfollow(){
      if(this.User?.id)
        {this.followService.unfollow(this.User?.id).pipe(
        timeout(50000)
        ).subscribe(
        (response) => {
          console.log(response)
          if (response.message = "Has dejado de seguir a este usuario"){
            if(this.User){
              this.User.is_following = false
            }
          }
        }, error => {
          console.log(error)
          if (error.name == "TimeOutError") {
            this.unfollow()
          }
        }
        )
      }
}
compartir(){
    const url ="https://igmarapruebameporfavor.site/user-profile/"+this.User?.id;
    navigator.clipboard.writeText(url).then(() => {  
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  
}
qr(){
  this.navigation.push('/qr-code/'+ this.id)
  this.router.navigate(['/qr-code/'+this.id]);
}
}
