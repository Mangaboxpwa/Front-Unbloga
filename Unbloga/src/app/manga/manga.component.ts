import { Component,ViewChild,ElementRef  } from '@angular/core';
import { RatingComponent } from "../rating/rating.component";
import { StarRateComponent } from "../star-rate/star-rate.component";
import { CommonModule } from '@angular/common';
declare var bootstrap: any; // 👈 declara la variable global

@Component({
  selector: 'app-manga',
  standalone: true,
  imports: [RatingComponent, StarRateComponent,CommonModule],
  templateUrl: './manga.component.html',
  styleUrl: './manga.component.css'
})
export class MangaComponent {
  @ViewChild('liveToast', { static: false }) liveToast!: ElementRef;
like = false;


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
}
