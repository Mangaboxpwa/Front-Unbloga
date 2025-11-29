import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {

  recognition: any;

  constructor() {

    // compatibilidad con Chrome
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Este navegador no soporta SpeechRecognition");
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'es-MX';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
  }

  start(callback: (text: string) => void) {
    if (!this.recognition) return;

    // limpiar eventos anteriores
    this.recognition.onresult = null;
    this.recognition.onend = null;

    this.recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1][0].transcript;
      callback(result);
    };

    this.recognition.start();
  }

  stop() {
    if (!this.recognition) return;

    // Esto fuerza a SpeechRecognition a liberarse
  this.recognition.onend = () => {
    this.recognition.onend = null; // evitar callback doble
  };
  
    this.recognition.stop();
  }
}
