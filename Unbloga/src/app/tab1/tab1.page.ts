import { Component } from '@angular/core';
import { IonRefresher, RefresherCustomEvent, IonRefresherContent, IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonImg, IonRow, IonGrid, IonIcon, IonList, IonItem } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { MangaService } from 'src/app/core/services/manga.service';
import { ReviewService } from '../core/services/review.service';
import { timeout } from 'rxjs';
import { Mangas } from '../core/interfaces/Mangas';
import { NgFor, NgIf, CommonModule } from '@angular/common';
import { ReviewsFromUser } from '../core/interfaces/ReviewsFromUser';
import { OfflineCacheService } from '../core/services/offline-cache.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CommonModule,NgIf,IonRefresher, IonRefresherContent, RouterLink,NgFor,IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonRow, IonGrid, IonIcon],
})
export class Tab1Page {
    mangas?: Mangas[];
    favoritos?: Mangas[];
    resenas: ReviewsFromUser[] = []

  constructor(private offlineCacheService:OfflineCacheService, private reviewService:ReviewService, private mangaService: MangaService,private router: Router) {}

  ngOnInit(): void {
    this.mangasMasReseñadosUltimoMes()
    this.mangasFavoritos()
    this.recentReviewsFromFollowing()
  }
  handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.ngOnInit()
      event.target.complete();
    }, 2000);
  }

  mangasMasReseñadosUltimoMes(){
      console.log('hola')
      this.mangaService.mangasMasReseñadosUltimoMes().pipe(
        timeout(50000)
      ).subscribe(
        (response) => {
          console.log(response.data)
          if (response.data){
            this.offlineCacheService.save('https://api.igmarapruebameporfavor.site/api/mangas/mas-recenados-mes', response.data)
            this.mangas = response.data
            console.log(this.mangas)
          }
        },  async error => {
          console.log(error)
          console.log(error.url)
          const dataOffline = await this.offlineCacheService.load(error.url);
          console.log(dataOffline)
          this.mangas = dataOffline
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
            this.offlineCacheService.save('https://api.igmarapruebameporfavor.site/api/mangas/mas-favoritos', response.data)
            this.favoritos = response.data
            console.log(this.favoritos)
          }
        }, async error => {
          console.log(error)
          const dataOffline = await this.offlineCacheService.load(error.url);
          this.favoritos = dataOffline
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
            this.resenas= response.data
            this.offlineCacheService.save('https://api.igmarapruebameporfavor.site/api/review/following', response.data)
          }
          console.log(this.resenas)
        }, async error => {
          console.log(error)
          if (error.error.message != 'Unauthenticated.'){
            console.log('?')
            const dataOffline = await this.offlineCacheService.load(error.url);
            this.resenas = dataOffline
          }
          if (error.name == "TimeOutError") {
            this.recentReviewsFromFollowing()
          }
          console.log(this.resenas)
        }
      )
  }
  formatoFecha(fecha:string){
    const date = new Date(fecha);

    const meses = [
      "Enero", "Febrero", "Marzo", "Abril",
      "Mayo", "Junio", "Julio", "Agosto",
      "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const mes = meses[date.getUTCMonth()];
    const dia = String(date.getUTCDate()).padStart(2, "0");

    const resultado = `${mes} ${dia}`;
    return resultado
  }
}

