import { Component } from '@angular/core';
import { IonItem, IonLabel, IonList, IonSearchbar,IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { MangaService } from 'src/app/core/services/manga.service';
import { timeout } from 'rxjs';
import { Mangas, MangasResponse } from '../core/interfaces/Mangas';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonItem, IonLabel, IonList, IonSearchbar,IonHeader, IonToolbar, IonTitle, IonContent]
})
export class Tab2Page {
  mangas?: Mangas[];
  constructor(private mangaService: MangaService,private router: Router) {
    this.indexMangas()
    this.mangas = undefined
  }
 public titles: string[] = [];
  public results: Mangas[] = []; // vacía al inicio

  handleInput(event: Event) {
  const target = event.target as HTMLIonSearchbarElement;
  const query = target.value?.toLowerCase().trim() || '';

  if (query.length === 0) {
    this.results = [];
    return;
  }

  // guarda los mangas filtrados (no solo títulos)
  this.results = this.mangas?.filter(manga =>
    manga.title.toLowerCase().includes(query)
  ) || [];
}

  indexMangas(){
    console.log('hola')
    this.mangaService.index().pipe(
      timeout(50000)
    ).subscribe(
      (response) => {
        console.log(response.data)
        if (response.data){
          this.mangas = response.data
          console.log(this.mangas)

        }
        
      }, error => {
        if (error.name == "TimeOutError") {
          this.indexMangas()
        }
      }
    )
  }
  verDetalle(id: number) {
  console.log('ID del manga seleccionado:', id);
  this.router.navigate(['/manga', id]); // opcional
}

}
