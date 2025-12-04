import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './captcha.component.html',
  styleUrls: ['./captcha.component.scss'],
})
export class CaptchaComponent {
@Output() resolved = new EventEmitter<string>();

  siteKey = environment.recaptchaSiteKey;

  ngAfterViewInit() {
    const win = window as any;

    // definimos callback global
    win.onCaptchaResolved = (token: string) => {
      this.resolved.emit(token);
    };

    // cargar script de Google si no existe
    if (!win.grecaptcha) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onCaptchaLoad&render=explicit&hl=es';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      win.onCaptchaLoad = () => this.renderCaptcha();
    } else {
      this.renderCaptcha();
    }
  }
   renderCaptcha() {
    const container = document.getElementById('captcha-container');
    const win = window as any;

    if (container && win.grecaptcha) {
      win.grecaptcha.render(container, {
        sitekey: this.siteKey,
        callback: 'onCaptchaResolved',
        theme: 'dark'
      });
    }
  }
}
