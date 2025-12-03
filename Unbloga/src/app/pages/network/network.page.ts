import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonRefresherContent, RefresherCustomEvent, IonButton, IonModal, IonActionSheet, IonList,IonItem, IonBadge, IonSegmentContent, IonLabel, IonSegment,IonSegmentButton,IonSegmentView, IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar, IonToast, IonIcon, IonRefresher } from '@ionic/angular/standalone';
import { Router, RouterLink,ActivatedRoute, } from '@angular/router';
import { FollowService } from 'src/app/core/services/follows.service';
import { timeout } from 'rxjs';
import { User } from 'src/app/core/interfaces/Users';
@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, IonButton, IonModal,IonToast, IonActionSheet, IonAvatar, IonList, IonItem, IonBadge,IonSegmentContent, IonLabel, IonSegment,IonSegmentButton,IonSegmentView,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NetworkPage implements OnInit {
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
      handler:()=>this.compartir(true),
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
  id:number = 0
  followers?:User[]
  following?:User[]
  UserActionSheet?:User
  indexUserSelected:number = 0
  isActionSheetOpen = false;
  isToastOpen = false;
  isModalOpen = false;
  onFollowers = false;
  constructor(private followService:FollowService, private router: Router,private route: ActivatedRoute,) { }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.id)
    if (this.id > 0){
      this.getFolllowersWithId()
      this.getFolllowingWithId()
    }else{
      this.getFolllowers()
      this.getFolllowing()
    }
  }
  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.ngOnInit()
      event.target.complete();
    }, 2000);
  }

  getFolllowers(){
    this.followService.followers().pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        
        if (response.data){
          this.followers = response.data
          console.log(this.followers)
        }
      }, error => {
        console.log(error)
        if (error.name == "TimeOutError") {
          this.getFolllowers()
        }
      }
    )
  }
  getFolllowing(){
    this.followService.following().pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          this.following = response.data
        }
      }, error => {
        console.log(error)
        if (error.name == "TimeOutError") {
          this.getFolllowing()
        }
      }
    )
  }
  getFolllowersWithId(){
    this.followService.followers(this.id).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          this.followers = response.data 
        }
      }, error => {
        console.log(error)
        if (error.name == "TimeOutError") {
          this.getFolllowers()
        }
      }
    )
  }
  getFolllowingWithId(){
    this.followService.following(this.id).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          this.following = response.data
        }
      }, error => {
        console.log(error)
        if (error.name == "TimeOutError") {
          this.getFolllowing()
        }
      }
    )
  }
  follow(){
    if(this.UserActionSheet?.id)
      {this.followService.follow(this.UserActionSheet?.id).pipe(
      timeout(50000)
      ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          if (this.onFollowers && this.followers){
            this.followers[this.indexUserSelected].is_following = true
            if (this.following){
              for (let i = 0; i < this.following.length; i++) {
                if (this.UserActionSheet?.id == this.following[i].id){
                  this.following[i].is_following = true
                }
              }
            }
          }
          if (!this.onFollowers && this.following){
            this.following[this.indexUserSelected].is_following = true
            if (this.followers){
            for (let i = 0; i < this.followers.length; i++) {
              if (this.UserActionSheet?.id == this.followers[i].id){
                this.followers[i].is_following = true
              }
            }
          }
          }
          this.setModalOpen(false)
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
    if(this.UserActionSheet?.id)
      {this.followService.unfollow(this.UserActionSheet?.id).pipe(
      timeout(50000)
      ).subscribe(
      (response) => {
        console.log(response)
        if (response.message = "Has dejado de seguir a este usuario"){
          if (this.onFollowers && this.followers){
            this.followers[this.indexUserSelected].is_following = false
            if (this.following){
              for (let i = 0; i < this.following.length; i++) {
                if (this.UserActionSheet?.id == this.following[i].id){
                  this.following[i].is_following = false
                }
              }
            }
          }
          if (!this.onFollowers && this.following){
            this.following[this.indexUserSelected].is_following = false
            if (this.followers){
            for (let i = 0; i < this.followers.length; i++) {
              if (this.UserActionSheet?.id == this.followers[i].id){
                this.followers[i].is_following = false
              }
            }
          }
          }
          this.setModalOpen(false)
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

  goToProfile(id: number) {
  this.router.navigate(['/user-profile', id]);
}
  openActions(event: Event, follower: any) {
  event.stopPropagation(); // ⛔ Evita activar el ion-item
  console.log("Abrir action sheet", follower);
  this.UserActionSheet = follower
  this.isActionSheetOpen = true;
}
setOpen(){
  this.isActionSheetOpen = false; 
}
compartir(isOpen:boolean){
  this.isToastOpen = isOpen;
  if (isOpen){
    const url ="https://igmarapruebameporfavor.site/user-profile/"+this.UserActionSheet?.id;
  navigator.clipboard.writeText(url).then(() => {
      
  }).catch(err => {
    console.error('Error al copiar:', err);
  });
  }
}
openActionsFollow(event: Event, follower: any, i:number, onFollowers:boolean) {
  event.stopPropagation(); // ⛔ Evita activar el ion-item
  console.log("Abrir action sheet", follower);
  this.UserActionSheet = follower
  this.setModalOpen(true)
  this.indexUserSelected = i
  this.onFollowers = onFollowers
}
setModalOpen(isOpen:boolean){
  this.isModalOpen = isOpen;
}
qr(){
  this.router.navigate(['/qr-code/'+this.UserActionSheet?.id]);
}
}
