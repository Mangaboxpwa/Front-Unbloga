import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { IonIcon,IonButtons,IonBackButton,IonItem,IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAlert, IonProgressBar, IonNote } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { timeout } from 'rxjs';
import { NavController } from '@ionic/angular';
import { arrowBackOutline, push } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.page.html',
  styleUrls: ['./send-email.page.scss'],
  standalone: true,
    imports: [IonIcon,IonNote, IonProgressBar, IonAlert, ReactiveFormsModule, IonButtons,IonBackButton,IonButton, IonItem,IonInput,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SendEmailPage implements OnInit {
emailForm: FormGroup;
contador = 0;
intervalo: any;
isAlertOpen = false;
message: any[] = [];
headerAlert = "";
subHeader = "";
btnUndefined = false
backendErrors  = ''

alertButtons = [
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
      },
    },
  ];
constructor(private navigation:NavigationService,private navCtrl: NavController,private fb: FormBuilder, private authService: Auth,private router: Router) {
  this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(320), Validators.email]],
    })
    addIcons({ arrowBackOutline });
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
  sendRecoverPasswordCode() {
    this.btnUndefined = true
    this.backendErrors = ''
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched(); // muestra los errores en pantalla
      this.btnUndefined = false
      return;
    }
    console.log("entra?")
    console.log(this.emailForm.value['email']);
    this.authService.sendRecoverPasswordCode(this.emailForm.value).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        this.btnUndefined = false
        console.log(response)
        sessionStorage.setItem('email',this.emailForm.value['email']);
        this.pushUrl('/recovery-code')
        this.router.navigate(['/recovery-code']);

      }, error => {
        this.backendErrors = error.error?.message
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
          this.sendRecoverPasswordCode()
        } else {
          this.scrollToTop()
        }
      }
    )
  }
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
}
