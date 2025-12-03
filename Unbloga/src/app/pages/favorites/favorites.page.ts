import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RefresherCustomEvent, IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonImg, IonRow, IonGrid, IonIcon, IonList, IonItem, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { NgFor } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { RatingComponent } from 'src/app/rating/rating.component';
import { ReviewsFromUser } from 'src/app/core/interfaces/ReviewsFromUser';
import { ReviewService } from 'src/app/core/services/review.service';
import { UserService } from 'src/app/core/services/user.service';
import { timeout } from 'rxjs';
import { UserMe } from 'src/app/core/interfaces/user_me';
import { Auth } from 'src/app/core/services/auth';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
imports: [IonRefresherContent, IonRefresher, CommonModule, RatingComponent,RouterLink,NgFor,IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonRow],
})
export class FavoritesPage implements OnInit {
Favorites?:ReviewsFromUser[]
id:number = 0
User?:UserMe

  constructor(private auth:Auth, private userService:UserService, private reviewService:ReviewService, private router: Router,private route: ActivatedRoute) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.id)
    if (this.id > 0){
      this.favoritesWithId()
      this.userInfo()
    }else{
      this.favorites()
      this.me()
    }
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
        }
      }, error => {
        console.log(error)
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
            }
            
          }, error => {
            console.log(error)
            if (error.name == "TimeOutError") {
              //this.indexMangas()
            }
          }
        )
  }
  favoritesWithId(){
      this.reviewService.favorite(this.id).pipe(
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
}
