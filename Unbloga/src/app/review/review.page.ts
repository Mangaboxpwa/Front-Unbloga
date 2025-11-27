import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRateComponent } from '../star-rate/star-rate.component';
import { RatingComponent } from '../rating/rating.component';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { MangaService } from 'src/app/core/services/manga.service';
import { ReviewService } from '../core/services/review.service';
import { timeout } from 'rxjs';
import { Manga, MangaResponse } from '../core/interfaces/Manga';
import { Reviews } from '../core/interfaces/Reviews';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
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
  rating: number = 0;
  like = false;
  id:number = -1
  reviewId:number = -1
  manga?:Manga
  ReviewForm:FormGroup
  isAlertOpen = false;
message: any[] = [];
headerAlert = "";
subHeader = "";
alertButtons = [
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
      },
    },
  ];

  constructor(private cookie: CookieService,private fb: FormBuilder,private router: Router,private route: ActivatedRoute, private mangaService:MangaService,private reviewService:ReviewService) { 
    this.ReviewForm = this.fb.group({
      manga_id: ['', [Validators.required]],
      rating: ['', [Validators.required]],
      review: ['', [Validators.required, Validators.maxLength(320)]],
      is_favorite: ['', [Validators.required]],
    })
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
  showManga(){
    console.log('entra')
    this.mangaService.show(this.id).pipe(
          timeout(50000)
        ).subscribe(
          (response) => {
            console.log(response)
            if (response.data){
              this.manga = response.data
              if (this.manga.user_review){
                this.rating = this.manga.user_review.rating
                this.like = this.manga.user_review.is_favorite
                this.reviewId = this.manga.user_review.id
              }else{
                this.rating = 0;
                this.like = false;
              }
            }
            
          }, error => {
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
        console.log(response)
        this.router.navigate(['manga/'+this.id]);
      }, error => {
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
        console.log(response)
        this.router.navigate(['manga/'+this.id]);
      }, error => {
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
}

