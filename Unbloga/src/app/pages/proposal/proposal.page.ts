import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Validators, FormBuilder,FormsModule,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { IonInput, IonTextarea, IonContent, IonHeader, IonTitle, IonToolbar, IonBackButton, IonButtons, IonItem, IonButton, IonAlert } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { ProposalsService } from 'src/app/core/services/proposals.service';
import { timeout } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.page.html',
  styleUrls: ['./proposal.page.scss'],
  standalone: true,
  imports: [IonInput, IonTextarea, ReactiveFormsModule,IonAlert, IonButton, IonItem, IonButtons, IonBackButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ProposalPage implements OnInit {

  proposalForm: FormGroup;

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

  constructor(private router:Router, private fb: FormBuilder, private proposalsService:ProposalsService) { 
    this.proposalForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(254)]],
      description: ['', [Validators.maxLength(320)]],
    })
  }

  ngOnInit() {
  }
  sendProposal(){
    console.log("entra?")
    console.log(this.proposalForm.value)
        
    this.proposalsService.store(this.proposalForm.value).pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response)
        this.headerAlert = response.message
        this.subHeader = "Gracias por tu sugerencia"
        this.message = ['Se revisará tu propuesta.']
        this.alertButtons = [
          {
            text: 'OK',
            role: 'Cerrar',
            handler: () => {
              this.router.navigate(['/tabs/tab1']);
            },
          },
        ];
        this.setOpen(true)
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
              this.sendProposal()
            }
          }
        )
  }
  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  } 
}
