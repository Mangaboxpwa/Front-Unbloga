import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RefresherCustomEvent,IonRefresherContent, IonRefresher, IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonImg, IonRow, IonGrid, IonIcon, IonList, IonItem, IonButtons, IonBackButton, IonButton } from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { RatingComponent } from 'src/app/rating/rating.component';
import { ReviewsFromUser } from 'src/app/core/interfaces/ReviewsFromUser';
import { ReviewService } from 'src/app/core/services/review.service';
import { UserService } from 'src/app/core/services/user.service';
import { timeout } from 'rxjs';
import { UserMe } from 'src/app/core/interfaces/user_me';
import { Auth } from 'src/app/core/services/auth';
import { ViewDidEnter, NavController } from '@ionic/angular';
import { OfflineCacheService } from 'src/app/core/services/offline-cache.service';
import { arrowBackOutline, push } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonButtons, IonRefresher,IonRefresherContent,CommonModule, RatingComponent,RouterLink,NgFor,IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonRow],
})
export class ReviewsPage implements OnInit,ViewDidEnter {
id:number = 0
User?:UserMe
Reviews?:ReviewsFromUser[]

constructor(private navigation:NavigationService,private offlineCacheService:OfflineCacheService, private navCtrl: NavController,private auth:Auth, private userService:UserService, private reviewService:ReviewService, private router: Router,private route: ActivatedRoute) { 
  addIcons({ arrowBackOutline });
}

ionViewDidEnter(): void {
    this.ngOnInit()
  }
  ngOnInit() {
      this.id = Number(this.route.snapshot.paramMap.get('id'));
      console.log(this.id)
      if (this.id > 0){
        this.reviewsWithId()
        this.userInfo()
      }else{
        this.reviews()
        this.me()
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

me(){
      this.auth.me().pipe(
        timeout(50000)
      ).subscribe(
        (response) => {
          console.log(response)
          if (response.data){
            this.User = response.data
            this.offlineCacheService.save('https://api.igmarapruebameporfavor.site/api/auth/me', response.data)
          }
        }, async error => {
          console.log(error)
          const dataOffline = await this.offlineCacheService.load(error.url);
          this.User = dataOffline
          if (error.name == "TimeOutError") {
            this.me()
          }
        }
      )
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
    this.reviewService.index().pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          this.Reviews = response.data
          this.offlineCacheService.save('https://api.igmarapruebameporfavor.site/api/review/user', response.data)
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

reviewsWithId(){
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
          this.reviewsWithId()
        }
      }
    )
  }
}
