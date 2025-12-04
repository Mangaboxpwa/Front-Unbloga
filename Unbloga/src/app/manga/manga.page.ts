import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonRefresherContent, IonButton,IonToast,IonItemDivider, IonAvatar,IonLabel,IonButtons,IonBackButton, IonList, IonItem,IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonImg, IonRow, IonGrid, IonIcon, IonRefresher } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { RatingComponent } from "../rating/rating.component";
import { StarRateComponent } from "../star-rate/star-rate.component";
import { Router, RouterLink } from '@angular/router';
import { MangaService } from 'src/app/core/services/manga.service';
import { timeout } from 'rxjs';
import { Manga, MangaResponse } from '../core/interfaces/Manga';
import { Reviews } from '../core/interfaces/Reviews';
import { User } from '../core/interfaces/Users';
import { RefresherCustomEvent } from '@ionic/core';
import { ViewDidEnter } from '@ionic/angular';

@Component({
  selector: 'app-manga',
  templateUrl: './manga.page.html',
  styleUrls: ['./manga.page.scss'],
  standalone: true,
  imports: [IonRefresherContent, IonRefresher, RouterLink, IonToast,IonItemDivider,StarRateComponent,CommonModule,IonAvatar,IonLabel,IonButtons,IonBackButton, IonList, IonItem,RatingComponent,IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonRow, IonGrid],
})
export class MangaPage implements OnInit, ViewDidEnter {
  @ViewChild('liveToast', { static: false }) liveToast!: ElementRef;
  like = false;
  rating: number = 0;
  manga?:Manga
  id:number = -1
  authors = ''
  reviews?:Reviews[]
  user_review?:Reviews
  user?:User
  constructor(private mangaService: MangaService,private router: Router,private route: ActivatedRoute,) { }
  
  ionViewDidEnter(): void {
    this.ngOnInit()
  }

  ngOnInit() {
     this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.id)
    if (this.id > 0){
      this.showManga()
    }
  }
  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.ngOnInit()
      event.target.complete();
    }, 2000);
  }
  

  copiarEnlace() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
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
irReview(){
  this.router.navigate(['/review', this.id]);
}

showManga(){
  console.log('entra')
  this.mangaService.show(this.id).pipe(
        timeout(50000)
      ).subscribe(
        (response) => {
          console.log(response)
          if (response.data){
            this.manga = response.data
            this.manga.publication_date = this.manga.publication_date.split("-")[0];
            this.authors = this.manga.authors.map((a: any) => a.name).join(', ');
            
            console.log(this.manga.publication_date)
            this.reviews = response.data.reviews

            if (this.manga.user_review){
              this.user_review = this.manga.user_review
              this.like = this.user_review.is_favorite
              this.rating = this.user_review.rating
            }
            
            console.log(this.reviews)
          }
          
        }, error => {
          if (error.name == "TimeOutError") {
            //this.indexMangas()
          }
        }
      )
}
}
