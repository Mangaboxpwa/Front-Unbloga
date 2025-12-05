import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { IonAlert,IonButtons,IonBackButton,IonItem,IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonRefresher, IonProgressBar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { timeout } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-new-pass',
  templateUrl: './new-pass.page.html',
  styleUrls: ['./new-pass.page.scss'],
  standalone: true,
  imports: [IonProgressBar, IonAlert,ReactiveFormsModule,IonButtons,IonBackButton,IonButton, IonItem,IonInput,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NewPassPage implements OnInit {
nuevaContrasenaForm: FormGroup;
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
  this.nuevaContrasenaForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      password_confirmation: ['', Validators.required],
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
  goBack() {
  this.navCtrl.back();
}
  enviarContrasenasNuevas() {
    this.btnUndefined = true
    console.log("entra?")
    console.log(this.nuevaContrasenaForm.value)
    this.authService.register(this.nuevaContrasenaForm.value).pipe(
      timeout(10000)
    ).subscribe(
      (response) => {
        this.btnUndefined = false
        console.log(response)
        this.headerAlert = response.message
        this.scrollToTop()
        this.subHeader = "Listo!"
        this.message = ['Tu contraseña ha sido actualizada']
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
