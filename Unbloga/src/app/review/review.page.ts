import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRateComponent } from '../star-rate/star-rate.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IonRefresherContent, RefresherCustomEvent, IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonRow, IonRefresher, IonProgressBar } from '@ionic/angular/standalone';
import { MangaService } from 'src/app/core/services/manga.service';
import { ReviewService } from '../core/services/review.service';
import { SpeechService } from '../core/services/speech.service';
import { timeout } from 'rxjs';
import { Manga, MangaResponse } from '../core/interfaces/Manga';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { NavController } from '@ionic/angular';

import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonGrid,
  IonCol,
  IonItem,
  IonLabel,
  IonList,
  IonThumbnail,
  IonBackButton,
   IonButtons,
   IonButton,
   IonTextarea
} from '@ionic/angular/standalone';
import { OfflineCacheService } from '../core/services/offline-cache.service';
import { NavigationService } from '../core/services/navigation.service';
import { arrowBackOutline, push } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
  standalone: true,
imports: [IonIcon, IonProgressBar, IonRefresher, 
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonRefresherContent,
    IonTextarea,
    IonCard,
   IonButtons,
   IonButton,
   CommonModule,
    IonCardContent,
    IonItem,
    IonLabel,
    IonList,
    IonThumbnail,
    StarRateComponent,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ReviewPage implements OnInit {
  microfono_estado:boolean = true;
  rating: number = 0;
  texto = '';
  like = false;
  id:number = -1
  reviewId:number = -1
  manga?:Manga
  ReviewForm:FormGroup
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

  constructor(private navigation:NavigationService, private offlineCacheService:OfflineCacheService, private navCtrl: NavController,private speechService: SpeechService, private cookie: CookieService,private fb: FormBuilder,private router: Router,private route: ActivatedRoute, private mangaService:MangaService,private reviewService:ReviewService) { 
    this.ReviewForm = this.fb.group({
      manga_id: ['', [Validators.required]],
      rating: ['', [Validators.required]],
      review: ['', [Validators.required, Validators.maxLength(320)]],
      is_favorite: ['', [Validators.required]],
    })
    addIcons({ arrowBackOutline });
  }

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    console.log(this.id)
    if (this.id > 0){
      this.showManga()
    }
    let token = this.cookie.get('token');
    console.log(token)
  }
  goBack() {
  if (this.navigation.canGoBack()) {
    this.navigation.back();
  } else {
    this.router.navigate(['/tab1']);
  }
}
  
handleRefresh(event: RefresherCustomEvent) {
    setTimeout(() => {
      this.ngOnInit()
      event.target.complete();
    }, 2000);
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
              if (this.manga.user_review){
                this.rating = this.manga.user_review.rating
                this.like = this.manga.user_review.is_favorite
                this.reviewId = this.manga.user_review.id
                this.ReviewForm.controls['review'].setValue(this.manga.user_review.review)
              }else{
                this.rating = 0;
                this.like = false;
              }
            }
            
          }, async error => {
            const dataOffline = await this.offlineCacheService.load(error.url);
            this.manga = dataOffline
            if (error.name == "TimeOutError") {
              //this.indexMangas()
            }
          }
        )
  }
onRatingChanged(newValue: number) {
    console.log('El rating cambió a:', newValue);
    this.rating = newValue;
    
  }
  darLike(){
  this.like = !this.like
}
guardar(){
  this.btnUndefined = true
  this.ReviewForm.controls['manga_id'].setValue(this.id)
  this.ReviewForm.controls['rating'].setValue(this.rating)
  this.ReviewForm.controls['is_favorite'].setValue(this.like)

  if (this.manga?.user_review){
    this.update()
  }else{
    this.create()
  }
}
create(){
  this.reviewService.store(this.ReviewForm.value).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        this.btnUndefined = false
        console.log(response)
        this.goBack()
      }, error => {
        this.btnUndefined = false
        console.log(error)
        console.log(error.error.data)
        const data = error.error.data;
        this.headerAlert = 'Error'
        this.subHeader = error.error.msg
        this.message = [];
        if (error.error.data){
          for (const campo in data) {
            this.message = this.message.concat(data[campo]);
          }
        }
        else if(error.error.message){
          this.message = [error.error.message]
        }
        console.log(this.message)
        this.alertButtons = [
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
            },
          },
        ];
        this.setOpen(true)
        if (error.name == "TimeOutError") {
          this.create()
        }
      }
    )
}
update(){
   this.reviewService.update(this.ReviewForm.value, this.reviewId).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        this.btnUndefined = false
        console.log(response)
        this.goBack()
      }, error => {
        this.btnUndefined = false
        console.log(error)
        console.log(error.error.data)
        const data = error.error.data;
        this.headerAlert = 'Error'
        this.subHeader = error.error.msg
        this.message = [];
        if (error.error.data){
          for (const campo in data) {
            this.message = this.message.concat(data[campo]);
          }
        }
        else if(error.error.message){
          this.message = [error.error.message]
        }
        console.log(this.message)
        this.alertButtons = [
          {
            text: 'OK',
            role: 'confirm',
            handler: () => {
            },
          },
        ];
        this.setOpen(true)
        if (error.name == "TimeOutError") {
          this.create()
        }
      }
    ) 
}
setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  } 

microfono(){
  if(this.microfono_estado){
    this.empezar()
  }else{
    this.detener()
  }
  this.microfono_estado = !this.microfono_estado
  
}
empezar() {
  this.speechService.start(t => this.texto = t);
}

detener() {
  this.speechService.stop();
  this.ReviewForm.controls['review'].setValue(this.texto)
  console.log(this.texto)
}
}

