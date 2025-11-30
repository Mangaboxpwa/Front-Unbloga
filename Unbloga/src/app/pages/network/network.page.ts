import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonActionSheet, IonList,IonItem, IonBadge, IonSegmentContent, IonLabel, IonSegment,IonSegmentButton,IonSegmentView, IonContent, IonHeader, IonTitle, IonToolbar, IonAvatar } from '@ionic/angular/standalone';
import { Router, RouterLink,ActivatedRoute } from '@angular/router';
import { FollowService } from 'src/app/core/services/follows.service';
import { timeout } from 'rxjs';
import { User } from 'src/app/core/interfaces/Users';
@Component({
  selector: 'app-network',
  templateUrl: './network.page.html',
  styleUrls: ['./network.page.scss'],
  standalone: true,
  imports: [IonActionSheet, IonAvatar, IonList, RouterLink, IonItem, IonBadge,IonSegmentContent, IonLabel, IonSegment,IonSegmentButton,IonSegmentView,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NetworkPage implements OnInit {
 public actionSheetButtons = [
    {
      text: 'Delete',
      role: 'destructive',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Share',
      handler:()=>this.compartir(),
      data: {
        action: 'share',
      },
    },
    {
      text: 'Cancel',
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
  isActionSheetOpen = false;
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
compartir(){

}
}
