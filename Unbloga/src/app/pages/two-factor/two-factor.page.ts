import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { IonIcon,IonButtons,IonBackButton,IonItem,IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAlert, IonProgressBar, IonNote } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { timeout } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { NotificationsService } from 'src/app/core/services/notifications.service';
import { NavController } from '@ionic/angular';
import { arrowBackOutline, push } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-two-factor',
  templateUrl: './two-factor.page.html',
  styleUrls: ['./two-factor.page.scss'],
  standalone: true,
  imports: [IonIcon,IonNote, IonProgressBar, IonAlert, ReactiveFormsModule, IonButtons,IonButton, IonItem,IonInput,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TwoFactorPage implements OnInit {
twoFactorForm: FormGroup;
contador = 0;
intervalo: any;
isAlertOpen = false;
message: any[] = [];
headerAlert = "";
subHeader = "";
btnUndefined = false
codigo_mal= ''
backendErrors: {
  code?: string[];
} | null = null;
alertButtons = [
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
      },
    },
  ];
constructor(private navigation:NavigationService,private navCtrl: NavController,private notify: NotificationsService,private cookies:CookieService, private fb: FormBuilder, private authService: Auth,private router: Router) {
  this.twoFactorForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(320), Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    })
    addIcons({ arrowBackOutline });
}
  ngOnInit() {
    console.log(sessionStorage.getItem('email'))
    this.twoFactorForm.controls['email'].setValue(sessionStorage.getItem('email'))
  }
  goBack() {
  if (this.navigation.canGoBack()) {
    this.navigation.back();
  } else {
    this.router.navigate(['/tab3']);
  }
}
pushUrl(url: string) {
    this.navigation.push(url);
  }
scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  enviarTwoFactor() {
    this.btnUndefined = true
    if (this.twoFactorForm.invalid) {
      this.twoFactorForm.markAllAsTouched(); // muestra los errores en pantalla
      this.btnUndefined = false
      return;
    }
    console.log("entra?")
    console.log(this.twoFactorForm)
    this.authService.verifyCode(this.twoFactorForm.value).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        this.codigo_mal= ''
        this.btnUndefined = false
        console.log(response)
        if (response.token){
          sessionStorage.removeItem('email');
          this.authService.isLogin(response.token)
          this.notify.requestPermission();

          this.me()
        }
      }, error => {
        this.btnUndefined = false
        this.backendErrors = error.error?.data ?? {};
        console.log(error)
        console.log(error.error.message)
        if(error.error.message){
          this.codigo_mal= error.error.message
        }
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
            // Inicializar Echo con token
            this.notify.initEcho();
            
            this.notify.listenToFollowerEvents(userId);
            this.notify.listenToBanEvents(userId);
            this.navigation.emptyStack()
            this.router.navigate(['/tab3']);
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
