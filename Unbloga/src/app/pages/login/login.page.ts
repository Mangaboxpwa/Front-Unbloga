import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { IonIcon,IonButtons,IonBackButton,IonItem,IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAlert, IonRefresher, IonProgressBar, IonNote } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { timeout } from 'rxjs';
import { CaptchaComponent } from 'src/app/shared/captcha/captcha.component';
import { NavController } from '@ionic/angular';
import { arrowBackOutline, push } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonIcon, IonProgressBar, CaptchaComponent, IonAlert, ReactiveFormsModule, IonButtons,IonButton, IonItem,IonInput,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
LoginForm: FormGroup;
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
  backendErrors = false
captchaToken:string = ''
constructor(private navigation:NavigationService,private navCtrl: NavController,private fb: FormBuilder, private authService: Auth,private router: Router) {
  this.LoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(320), Validators.email]],
      password: ['', [Validators.required, Validators.maxLength(72)]],
      captcha:['',[Validators.required]]
    })
  addIcons({ arrowBackOutline });
}
onCaptchaResolved(token:string){
  this.captchaToken = token
  this.LoginForm.get('captcha')?.setValue(token)
  console.log(token)
}
  ngOnInit() {
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
  enviarLogin() {
    this.btnUndefined = true
    console.log("entra?")
    console.log(this.LoginForm)
    if (this.LoginForm.invalid) {
      this.LoginForm.markAllAsTouched(); // muestra los errores en pantalla
      this.btnUndefined = false
      return;
    }
    
    this.authService.login(this.LoginForm.value).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        this.backendErrors = true
        this.btnUndefined = false
        console.log(response)
        sessionStorage.setItem('email',''+response.email)
        this.pushUrl('/two-factor')
        this.router.navigate(['two-factor']);
      }, error => {
        this.backendErrors = true
        this.btnUndefined = false
        console.log(error)
        console.log(error.error.data)
         this.backendErrors = error.error?.data ?? {};
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
          this.enviarLogin()
        } else {
          this.scrollToTop()
        }
      }
    )
  }
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }  
  goRegister() {
    this.pushUrl('/register')
    this.router.navigate(['/register']);
  }
  recuperarContrasena(){
    this.pushUrl('/send-email')
   this.router.navigate(['/send-email']);
  }

}
