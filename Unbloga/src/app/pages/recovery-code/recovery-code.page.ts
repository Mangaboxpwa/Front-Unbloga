import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { IonIcon,IonButtons,IonBackButton,IonItem,IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAlert, IonRefresher, IonProgressBar, IonNote } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { timeout } from 'rxjs';
import { NavController } from '@ionic/angular';
import { arrowBackOutline, push } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-recovery-code',
  templateUrl: './recovery-code.page.html',
  styleUrls: ['./recovery-code.page.scss'],
  standalone: true,
  imports: [IonIcon,IonNote, IonProgressBar, IonRefresher, IonAlert, ReactiveFormsModule, IonButtons,IonBackButton,IonButton, IonItem,IonInput,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RecoveryCodePage implements OnInit {
recoveryCodeForm: FormGroup;
contador = 0;
intervalo: any;
isAlertOpen = false;
message: any[] = [];
headerAlert = "";
subHeader = "";
btnUndefined = false
backendErrors: {
  code?: string[];
} | null = null;
messageError = ''
alertButtons = [
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
      },
    },
  ];
constructor(private navigation:NavigationService,private navCtrl: NavController,private fb: FormBuilder, private authService: Auth,private router: Router) {
  this.recoveryCodeForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(320), Validators.email]],
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    })
    addIcons({ arrowBackOutline });
}
  ngOnInit() {
    console.log(sessionStorage.getItem('email'))
    this.recoveryCodeForm.controls['email'].setValue(sessionStorage.getItem('email'))
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
  enviarRecoveryCode() {
    this.messageError = ''
    this.btnUndefined = true
    if (this.recoveryCodeForm.invalid) {
      this.recoveryCodeForm.markAllAsTouched(); // muestra los errores en pantalla
      this.btnUndefined = false
      return;
    }
    console.log("entra?")
    this.authService.verifyCode(this.recoveryCodeForm.value).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        this.btnUndefined = false
        console.log(response)
        if (response.token){
          this.pushUrl('/new-pass')
          this.router.navigate(['/new-pass']);
        }
      }, error => {
        this.backendErrors = error.error?.data ?? {};
        this.messageError = error.error.message
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
          this.enviarRecoveryCode()
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
    this.authService.sendRecoverPasswordCode({email:sessionStorage.getItem('email')}).pipe(
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
}