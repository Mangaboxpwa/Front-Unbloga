import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonButton,IonToast,IonItemDivider, IonAvatar,IonLabel,IonButtons,IonBackButton, IonList, IonItem,IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonImg, IonRow, IonGrid, IonIcon} from '@ionic/angular/standalone';

import { RatingComponent } from "../rating/rating.component";
import { StarRateComponent } from "../star-rate/star-rate.component";
declare var bootstrap: any; // 👈 declara la variable global

@Component({
  selector: 'app-manga',
  templateUrl: './manga.page.html',
  styleUrls: ['./manga.page.scss'],
  standalone: true,
  imports: [IonButton,IonToast,IonItemDivider,StarRateComponent,CommonModule,IonAvatar,IonLabel,IonButtons,IonBackButton, IonList, IonItem,RatingComponent,IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonImg, IonRow, IonGrid, IonIcon],
})
export class MangaPage implements OnInit {
  @ViewChild('liveToast', { static: false }) liveToast!: ElementRef;
  like = false;
  rating: number = 3.5;

  constructor() { }

  ngOnInit() {
  }

  copiarEnlace() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      this.mostrarToast();
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  }

  mostrarToast() {
    if (this.liveToast) {
      const toast = new bootstrap.Toast(this.liveToast.nativeElement); // ✅ usar bootstrap.Toast
      toast.show();
    }
  }

darLike(){
  if (this.like){
    this.like = false
  }else{
    this.like = true
  }
}
onRatingChanged(newValue: number) {
    console.log('El rating cambió a:', newValue);
    this.rating = newValue;
    // Aquí haces la petición HTTP, por ejemplo:
    // this.http.post('/api/rating', { value: newValue }).subscribe(...)
  }
  abrirModal() {
    // aquí metes tu modal con reseña
  }
}
