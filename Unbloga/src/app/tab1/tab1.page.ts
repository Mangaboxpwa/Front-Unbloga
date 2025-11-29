import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonImg, IonRow, IonGrid, IonIcon, IonList, IonItem } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { RatingComponent } from '../rating/rating.component';
import { Router, RouterLink } from '@angular/router';
import { MangaService } from 'src/app/core/services/manga.service';
import { ReviewService } from '../core/services/review.service';
import { timeout } from 'rxjs';
import { Mangas, MangasResponse } from '../core/interfaces/Mangas';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [RouterLink,NgFor,IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonRow, IonGrid, IonIcon],
})
export class Tab1Page {
    mangas?: Mangas[];
    favoritos?: Mangas[];

  constructor(private reviewService:ReviewService, private mangaService: MangaService,private router: Router) {}

  ngOnInit(): void {
    this.mangasMasReseñadosUltimoMes()
    this.mangasFavoritos()
    this.recentReviewsFromFollowing()
  }

  mangasMasReseñadosUltimoMes(){
      console.log('hola')
      this.mangaService.mangasMasReseñadosUltimoMes().pipe(
        timeout(50000)
      ).subscribe(
        (response) => {
          console.log(response.data)
          if (response.data){
            this.mangas = response.data
            console.log(this.mangas)
          }
        }, error => {
          console.log(error)
          if (error.name == "TimeOutError") {
            this.mangasMasReseñadosUltimoMes()
          }
        }
      )
  }

  mangasFavoritos(){
      console.log('hola')
      this.mangaService.mangasFavoritos().pipe(
        timeout(50000)
      ).subscribe(
        (response) => {
          console.log(response.data)
          if (response.data){
            this.favoritos = response.data
            console.log(this.favoritos)
          }
        }, error => {
          console.log(error)
          if (error.name == "TimeOutError") {
            this.mangasFavoritos()
          }
        }
      )
  }
  recentReviewsFromFollowing(){
      this.reviewService.recentReviewsFromFollowing().pipe(
        timeout(50000)
      ).subscribe(
        (response) => {
          console.log(response)
          if (response.data){
            
          }
        }, error => {
          console.log(error)
          if (error.name == "TimeOutError") {
            this.recentReviewsFromFollowing()
          }
        }
      )
  }
}

