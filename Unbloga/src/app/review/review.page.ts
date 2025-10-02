import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StarRateComponent } from '../star-rate/star-rate.component';
import { RatingComponent } from '../rating/rating.component';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonBackButton,
   IonButtons,
   IonButton,
   IonTextarea
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
  standalone: true,
imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonTextarea,
    IonCard,
    IonBackButton,
   IonButtons,
   IonButton,
   CommonModule,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonItem,
    IonLabel,
    IonList,
    IonThumbnail,
    StarRateComponent,
    RatingComponent
  ],
})
export class ReviewPage implements OnInit {
  rating: number = 3.5;
  like = false;

  constructor() { }

  ngOnInit() {
  }
onRatingChanged(newValue: number) {
    console.log('El rating cambió a:', newValue);
    this.rating = newValue;
    // Aquí haces la petición HTTP, por ejemplo:
    // this.http.post('/api/rating', { value: newValue }).subscribe(...)
  }
  darLike(){
  if (this.like){
    this.like = false
  }else{
    this.like = true
  }
}
guardar(){
  
}
}

