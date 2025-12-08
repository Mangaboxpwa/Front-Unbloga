import { Component } from '@angular/core';
import { IonSegment,IonSegmentContent,IonSegmentView, IonRefresher,IonRefresherContent, RefresherCustomEvent, IonItem, IonLabel, IonList, IonSearchbar,IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonSegmentButton } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { MangaService } from 'src/app/core/services/manga.service';
import { timeout } from 'rxjs';
import { Mangas } from '../core/interfaces/Mangas';
import { scan, book } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Auth } from '../core/services/auth';
import { NgIf } from '@angular/common';
import { OfflineCacheService } from '../core/services/offline-cache.service';
import { NavigationService } from 'src/app/core/services/navigation.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [NgIf,RouterLink, IonSegment,IonSegmentContent,IonSegmentView, IonSegmentButton, IonIcon, IonRefresher,IonRefresherContent, IonItem, IonLabel, IonList, IonSearchbar,IonHeader, IonToolbar, IonContent]
})
export class Tab2Page {
  isScanning = false;
  private reader = new BrowserMultiFormatReader();
  private currentDeviceId?: string;
  private scannerControls: any;

  mangas?: Mangas[];
  public titles: string[] = [];
  public results: Mangas[] = []; // vacía al inicio
  isEmpty = false;

  constructor(private navigation:NavigationService,private offlineCacheService:OfflineCacheService, private auth:Auth, private mangaService: MangaService,private router: Router) {
    addIcons({ scan,book });
  }

  ionViewDidEnter(): void {
    this.navigation.fallback = '/tab2'
  }
ngOnInit(): void {
  this.indexMangas()
}
pushUrl(url: string) {
    this.navigation.push(url);
  }
handleRefresh(event: RefresherCustomEvent) {
  setTimeout(() => {
    this.ngOnInit()
    event.target.complete();
  }, 2000);
}

handleInput(event: Event) {
  const target = event.target as HTMLIonSearchbarElement;
  const query = target.value?.toLowerCase().trim() || '';

  if (query.length === 0) {
    this.isEmpty = false
    this.results = [];
    return;
  }

  // guarda los mangas filtrados (no solo títulos)
  this.results = this.mangas?.filter(manga =>
    manga.title.toLowerCase().includes(query)
  ) || [];
  console.log(this.results.length)
  console.log(this.auth.isLoggedIn())
  if (this.results.length == 0 && this.auth.isLoggedIn()){
    console.log(0)
    this.isEmpty = true
  }else{
    this.isEmpty = false
  }
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
          this.offlineCacheService.save('mangas-index', response.data)
        }
        
      }, async error => {
        console.log(error.url)
        const dataOffline = await this.offlineCacheService.load('mangas-index');
        this.mangas = dataOffline
        if (error.name == "TimeOutError") {
          this.indexMangas()
        }
      }
    )
}
verDetalle(id: number) {
  console.log('ID del manga seleccionado:', id);
  this.pushUrl('/manga/'+ id)
  this.router.navigate(['/manga', id]);
}



toggleScanner() {
    if (this.isScanning) {
      this.stopScanner();
    } else {
      this.startScanner();
    }
}
private async pedirPermisoCamara(): Promise<boolean> {
  try {
    // si permite acceso, regresará stream
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(t => t.stop());
    return true;
  } catch (e) {
    console.warn("Permiso de cámara bloqueado o denegado:", e);

    // Intento extra para que vuelva a lanzar el prompt (a veces funciona)
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      return true;
    } catch {
      return false; // realmente bloqueado
    }
  }
}

async startScanner() {
  this.isScanning = true;

  // 1. Checar permiso ANTES de listar dispositivos
  const permisoOk = await this.pedirPermisoCamara();
  if (!permisoOk) {
    this.isScanning = false;
    alert("No has dado permisos de cámara. Actívalos en configuración.");
    return;
  }

  const video = document.getElementById('video') as HTMLVideoElement;
  if (!video) {
    console.error('No existe el elemento video');
    this.isScanning = false;
    return;
  }

  try {
    const devices = await BrowserMultiFormatReader.listVideoInputDevices();

    if (devices.length > 0) {
      const backCamera = devices.find(d => d.label?.toLowerCase().includes('back'));
      this.currentDeviceId = backCamera?.deviceId ?? devices[0].deviceId;
    } else {
      this.currentDeviceId = undefined;
    }

    try {
      this.scannerControls = this.reader.decodeFromVideoDevice(
        this.currentDeviceId ?? undefined,
        video,
        (result, err) => {
          if (!this.isScanning) return;
          if (result) {
            const qrText = result.getText();
            console.log('QR detectado:', qrText);

            this.stopScanner();
            this.handleQR(qrText);
          }

          if (err && !(err as any).name?.includes('NotFoundException')) {
            console.warn(err);
          }
        }
      );
    } catch (e) {
      console.warn('decodeFromVideoDevice lanzó:', e);
    }
  } catch (err) {
    console.error(err);
    this.isScanning = false;
  }
}


stopScanner() {
  console.log("deteniendo scanner");

  this.isScanning = false;

  try {
    if (this.scannerControls) {
      this.scannerControls.stop(); // <- ZXing detiene su stream
      this.scannerControls = null;
    }
  } catch (e) {
    console.warn("Error deteniendo scannerControls", e);
  }

  const video = document.getElementById('video') as HTMLVideoElement;
  const stream = video?.srcObject as MediaStream;

  if (stream) {
    stream.getTracks().forEach(t => {
      console.log("track detenido:", t);
      t.stop();
    });
  }

  if (video) {
    video.srcObject = null;
  }
  navigator.mediaDevices.getUserMedia({ video: true })
  .then(s => s.getTracks().forEach(t => t.stop()))
  .catch(() => {});

}

// Mejor hacer una función que reciba el string directamente
handleQR(qr: string) {
    // ejemplo: llamamos a una función que haga la búsqueda por texto
    const parts = qr.split("/");
  const id = parts.pop()!;
  const path = "/" + parts.pop()! + "/";

    this.pushUrl(path+id)
    this.router.navigate([path, id]);
    console.log(qr)
}

ngOnDestroy() {
    this.stopScanner();
}
}
