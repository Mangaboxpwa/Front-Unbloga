import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonActionSheet, IonButtons, IonBadge, IonCol,IonRow,IonCard,IonItem,IonList,IonLabel,IonAvatar,IonImg,IonButton,IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonToast } from '@ionic/angular/standalone';
import { Router, RouterLink,ActivatedRoute } from '@angular/router';
import { timeout } from 'rxjs';
import { ReviewsFromUser } from 'src/app/core/interfaces/ReviewsFromUser';
import { UserMe } from 'src/app/core/interfaces/user_me';
import { Auth } from 'src/app/core/services/auth';
import { ReviewService } from 'src/app/core/services/review.service';
import { UserService } from 'src/app/core/services/user.service';
import { FollowService } from 'src/app/core/services/follows.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
  standalone: true,
  imports: [IonActionSheet, IonToast, IonButtons, FormsModule, CommonModule, IonButton, RouterLink,IonBadge, IonCol,IonRow,IonCard,IonItem,IonLabel,IonAvatar,IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
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
  constructor(private router:Router, private followService:FollowService, private userService:UserService, private reviewService:ReviewService, private route: ActivatedRoute, private AuthService:Auth) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.id)
    if (this.id > 0){
      this.userInfo()
      this.reviews()
      this.favorites()
    }
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
        }
      }, error => {
        console.log(error)
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
  this.router.navigate(['/qr-code/'+this.id]);
}
}
