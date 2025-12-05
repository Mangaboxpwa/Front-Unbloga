import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { IonAlert,IonButtons,IonBackButton,IonItem,IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonProgressBar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { timeout } from 'rxjs';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonProgressBar, IonAlert,ReactiveFormsModule,IonButtons,IonBackButton,IonButton, IonItem,IonInput,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RegisterPage implements OnInit {
RegistrarForm: FormGroup;
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
constructor(private navCtrl: NavController,private fb: FormBuilder, private authService: Auth,private router: Router) {
  this.RegistrarForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(72), Validators.pattern(/^[a-zA-Z]+(\s[a-zA-Z]+)*\s*$/)]],
      email: ['', [Validators.required, Validators.maxLength(320), Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      password_confirmation: ['', Validators.required],
    })
}

  ngOnInit() {
  }
  goBack() {
  this.navCtrl.back();
}
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
  enviarRegistro() {
    this.btnUndefined = true
    console.log("entra?")
    console.log(this.RegistrarForm.value)
    this.authService.register(this.RegistrarForm.value).subscribe(
      (response) => {
        this.btnUndefined = false
        console.log(response)
        this.headerAlert = response.message
        this.scrollToTop()
        this.subHeader = "Revisa el correo"
        this.message = ['Se te envió un código de verificación para activar tu cuenta a el correo registrado.']
        this.alertButtons = [
          {
            text: 'OK',
            role: 'Cerrar',
            handler: () => {
              this.goLogin()
            },
          },
        ];
        this.setOpen(true)

      }, error => {
        this.btnUndefined = false
        console.log(error)
        console.log(error.error.data)
        const data = error.error.data;
        this.headerAlert = 'Error'
        this.subHeader = error.error.msg
        this.message = [];
        for (const campo in data) {
          this.message = this.message.concat(data[campo]);
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
          //this.enviarRegistro()
          console.log("timeout")
        } else {
          this.scrollToTop()
        }
      }
    )
  }
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
  goLogin() {
    this.router.navigate(['/login']);
  }
}
