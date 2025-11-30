import { Component,ViewChild,ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  IonBadge, IonCol,IonRow,IonCard,IonItem,IonList,IonLabel,IonAvatar,IonImg,IonButton,IonHeader, IonToolbar, IonTitle, IonContent, IonIcon } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../core/services/auth';
import { ReviewService } from '../core/services/review.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { timeout } from 'rxjs';
import { UserMe } from '../core/interfaces/user_me';
import { ReviewsFromUser } from '../core/interfaces/ReviewsFromUser';

Chart.register(...registerables);


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonBadge, RouterLink,IonCol,IonRow,IonCard,IonItem,IonList,IonLabel,IonAvatar,CommonModule,IonButton,IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Tab3Page {
  @ViewChild('barCanvas') private barCanvas!: ElementRef;
  private barChart!: Chart;
  User?:UserMe
  Reviews?:ReviewsFromUser[]
  Favorites?:ReviewsFromUser[]
constructor(private reviewService:ReviewService, private router: Router, private auth: Auth) {
}

ngOnInit(): void {
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
  if (this.auth.isLoggedIn()){
    this.me()
    this.index()
    this.favorites()
  }
}
  get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  goLogin() {
    this.router.navigate(['/login']);
  }

  goRegister() {
    this.router.navigate(['/register']);
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/tabs/tab3']);
  }

  me(){
    this.auth.me().pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          this.User = response.data
        }
      }, error => {
        console.log(error)
        if (error.name == "TimeOutError") {
          this.me()
        }
      }
    )
  }
  index(){
    this.reviewService.index().pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          this.Reviews = response.data
        }
      }, error => {
        console.log(error)
        if (error.name == "TimeOutError") {
          this.index()
        }
      }
    )
  }
  favorites(){
    this.reviewService.favorite().pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.data){
          this.Favorites = response.data
        }
      }, error => {
        console.log(error)
        if (error.name == "TimeOutError") {
          this.favorites()
        }
      }
    )
  }
/*   ngAfterViewChecked() {
  // Si ya existe el canvas y no he creado el chart, lo creo
  if (this.barCanvas && !this.barChart) {
    this.loadChart();
  }
}

  loadChart() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: Array(10).fill(''), // sin etiquetas
        datasets: [{
          data: [12, 19, 3, 5, 2, 3, 15, 7, 9, 4],
          backgroundColor: '#3b82f6', // azul Tailwind (puedes cambiarlo)
          borderRadius: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // sin leyenda
          tooltip: { enabled: false } // sin tooltips
        },
        scales: {
          x: {
            display: false, // oculta eje X
            grid: { display: false }
          },
          y: {
            display: false, // oculta eje Y
            grid: { display: false }
          }
        },
        layout: {
          padding: 0
        },
        onHover: (event, elements) => {
          const el = event.native?.target as HTMLElement;
          el.style.cursor = elements.length ? 'pointer' : 'default';
        },
        onClick: (event, elements) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            console.log('Click en barra', index);
          }
        }
      }
    });
  }

  onMouseDown() {
    console.log('Presionando...');
    // Aquí puedes poner tu acción al mantener presionado
  }

  onMouseUp() {
    console.log('Soltado');
  } */
}
