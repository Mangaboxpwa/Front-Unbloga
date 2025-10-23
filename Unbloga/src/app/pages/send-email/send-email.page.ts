import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { IonButtons,IonBackButton,IonItem,IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAlert } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-send-email',
  templateUrl: './send-email.page.html',
  styleUrls: ['./send-email.page.scss'],
  standalone: true,
    imports: [IonAlert, ReactiveFormsModule, IonButtons,IonBackButton,IonButton, IonItem,IonInput,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SendEmailPage implements OnInit {
emailForm: FormGroup;
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
constructor(private fb: FormBuilder, private authService: Auth,private router: Router) {
  this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(320), Validators.email]],
    })
}
  ngOnInit() {
  }
scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  sendRecoverPasswordCode() {
    console.log("entra?")
    console.log(this.emailForm.value['email']);
    this.authService.sendRecoverPasswordCode(this.emailForm.value).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        sessionStorage.setItem('email',this.emailForm.value['email']);
        this.router.navigate(['/recovery-code']);

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
