import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { IonButtons,IonBackButton,IonItem,IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAlert } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { timeout } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { SwUpdate } from '@angular/service-worker';


@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.page.html',
  styleUrls: ['./two-factor.page.scss'],
  standalone: true,
  imports: [IonAlert, ReactiveFormsModule, IonButtons,IonBackButton,IonButton, IonItem,IonInput,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TwoFactorPage implements OnInit {
twoFactorForm: FormGroup;
contador = 0;
intervalo: any;
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
constructor(private notify: NotificationsService,private cookies:CookieService, private fb: FormBuilder, private authService: Auth,private router: Router) {
  this.twoFactorForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(320), Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    })
}
  ngOnInit() {
    console.log(sessionStorage.getItem('email'))
    this.twoFactorForm.controls['email'].setValue(sessionStorage.getItem('email'))
  }
scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  enviarTwoFactor() {
    console.log("entra?")
    console.log(this.twoFactorForm)
    this.authService.verifyCode(this.twoFactorForm.value).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        if (response.token){
          sessionStorage.removeItem('email');
          this.authService.isLogin(response.token)
          this.me()
        }
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
          this.enviarTwoFactor()
        } else {
          this.scrollToTop()
        }
      }
    )
  }
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }  
  iniciarContador() {
  this.contador = 30; // segundos
  this.reenviarCodigo()
  this.intervalo = setInterval(() => {
    this.contador--;
    if (this.contador === 0) {
      clearInterval(this.intervalo);
    }
  }, 1000);
  }
  reenviarCodigo() {
    this.authService.sendCodeVerify({email:sessionStorage.getItem('email')}).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
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
          this.reenviarCodigo()
        } else {
          this.scrollToTop()
        }
      }
    )
  }
    me(){
      this.authService.me().pipe(
        timeout(50000)
      ).subscribe(
        (response) => {
          console.log(response)
          if (response.data){
            const userId = response.data.id; 
            this.notify.requestPermission();
            this.notify.listenToFollowerEvents(userId);
            this.router.navigate(['/tabs/tab3']);
          }
        }, error => {
          console.log(error)
          if (error.name == "TimeOutError") {
            this.me()
          }
        }
      )
    }
}
