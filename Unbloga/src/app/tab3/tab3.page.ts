import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonImg,IonButton,IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from '../services/auth';
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [CommonModule,IonButton,IonHeader, IonToolbar, IonTitle, IonContent],
})
export class Tab3Page {
constructor(private router: Router, private auth: Auth) {}

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
}
