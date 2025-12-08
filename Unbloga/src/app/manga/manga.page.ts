import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {IonRefresherContent, IonButton,IonToast,IonItemDivider, IonAvatar,IonLabel,IonButtons,IonBackButton, IonList, IonItem,IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonCardContent, IonImg, IonRow, IonGrid, IonIcon, IonRefresher, IonAlert } from '@ionic/angular/standalone';
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
import { ViewDidEnter, NavController } from '@ionic/angular';
import { Auth } from '../core/services/auth';
import { OfflineCacheService } from '../core/services/offline-cache.service';
import { Location } from '@angular/common';
import { NavigationService } from '../core/services/navigation.service';
import { arrowBackOutline, push } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-manga',
  templateUrl: './manga.page.html',
  styleUrls: ['./manga.page.scss'],
  standalone: true,
  imports: [IonIcon, IonAlert, IonRefresherContent, IonRefresher, RouterLink, IonToast,IonItemDivider,StarRateComponent,CommonModule,IonAvatar,IonLabel,IonButtons,IonButton, IonList, IonItem,RatingComponent,IonHeader, IonToolbar, IonTitle, IonContent, IonCol, IonCard, IonRow, IonGrid],
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

    isAlertOpen = false;
message: any[] = [];
headerAlert = "";
subHeader = "";
btnUndefined = false
alertButtons = [
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
      },
    },
  ];
  constructor(private navigation: NavigationService,private location:Location, private offlineCacheService:OfflineCacheService, private auth:Auth, private navCtrl: NavController, private mangaService: MangaService,private router: Router,private route: ActivatedRoute,) { 
    addIcons({ arrowBackOutline });
  }
  
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
  goBack() {
  if (this.navigation.canGoBack()) {
    console.log('yes')
    this.navigation.back();
  } else {
    console.log('else')
    this.router.navigate(['/tab1']);
  }
}
pushUrl(url: string) {
    this.navigation.push(url);
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
  if (this.auth.isLoggedIn()){
    this.pushUrl('/review/'+this.id)
    this.router.navigate(['/review', this.id]);
  }else{
    this.headerAlert = 'Denegado'
        this.subHeader = "Inicia sesión"
        this.message = ['Se necesita iniciar sesión para hacer una reseña.']
        this.alertButtons = [
          {
            text: 'OK',
            role: 'Cerrar',
            handler:()=>{}
          },
        ];
        this.setOpen(true)
  }
  
  
}
setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
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

            this.offlineCacheService.save('https://api.igmarapruebameporfavor.site/api/mangas/'+this.id, response.data)

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
          
        }, async error => {
          const dataOffline = await this.offlineCacheService.load(error.url);
          this.manga = dataOffline
          if (this.manga)
          {this.manga.publication_date = this.manga.publication_date.split("-")[0];
            this.authors = this.manga.authors.map((a: any) => a.name).join(', ');
            
            console.log(this.manga.publication_date)
            this.reviews = this.manga.reviews

            if (this.manga.user_review){
              this.user_review = this.manga.user_review
              this.like = this.user_review.is_favorite
              this.rating = this.user_review.rating
            }}

          if (error.name == "TimeOutError") {
            //this.indexMangas()
          }
        }
      )
}
}
