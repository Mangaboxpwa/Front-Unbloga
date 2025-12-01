import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonImg, IonRow, IonGrid, IonIcon, IonList, IonItem } from '@ionic/angular/standalone';
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
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
  standalone: true,
  imports: [CommonModule, RatingComponent,RouterLink,NgFor,IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonRow],
})
export class ReviewsPage implements OnInit {
id:number = 0
User?:UserMe
Reviews?:ReviewsFromUser[]

constructor(private auth:Auth, private userService:UserService, private reviewService:ReviewService, private router: Router,private route: ActivatedRoute) { }

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
reviews(){
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
        }
      }, error => {
        console.log(error)
        if (error.name == "TimeOutError") {
          this.reviewsWithId()
        }
      }
    )
  }
}
