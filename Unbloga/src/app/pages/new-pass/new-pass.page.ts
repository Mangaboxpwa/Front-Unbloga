import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { IonNote, IonIcon,IonAlert,IonButtons,IonBackButton,IonItem,IonInput, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonRefresher, IonProgressBar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { Auth } from 'src/app/core/services/auth';
import { timeout } from 'rxjs';
import { NavController } from '@ionic/angular';
import { arrowBackOutline, push } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-new-pass',
  templateUrl: './new-pass.page.html',
  styleUrls: ['./new-pass.page.scss'],
  standalone: true,
  imports: [IonNote, IonIcon,IonProgressBar, IonAlert,ReactiveFormsModule,IonButtons,IonButton, IonItem,IonInput,IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
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
  backendErrors: {
  password?: string[];
  password_confirmation?: string[];
} | null = null;
constructor(private navigation:NavigationService,private navCtrl: NavController,private fb: FormBuilder, private authService: Auth,private router: Router) {
  this.nuevaContrasenaForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
      password_confirmation: ['', Validators.required],
    })
    addIcons({ arrowBackOutline });
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
  if (this.navigation.canGoBack()) {
    this.navigation.back();
  } else {
    this.router.navigate(['/tab3']);
  }
}
pushUrl(url: string) {
    this.navigation.push(url);
  }
  enviarContrasenasNuevas() {

    this.btnUndefined = true
    if (this.nuevaContrasenaForm.invalid) {
      this.nuevaContrasenaForm.markAllAsTouched(); // muestra los errores en pantalla
      this.btnUndefined = false
      return;
    }
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
        this.backendErrors = error.error?.data ?? {};
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
    this.navigation.emptyStack()
    this.pushUrl('/login')
    this.router.navigate(['/login']);
  }
}
