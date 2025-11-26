import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Responses } from '../interfaces/Responses';
import { CookieService } from 'ngx-cookie-service';
import { LoginResponse } from '../interfaces/Login';

@Injectable({
  providedIn: 'root'
})
export class Auth {
 
  //private loggedIn = false;
  private urlBase:string
  constructor(private cookies:CookieService, private http: HttpClient) { 
    this.urlBase = `${environment.apiUrlBase}auth/`
  }
  register(user:any): Observable<Responses>{
    return this.http.post<Responses>(`${this.urlBase}register`, user);
  }
  login(user:any): Observable<LoginResponse>{
    return this.http.post<LoginResponse>(`${this.urlBase}login`, user);
  }
  verifyCode(user:any): Observable<Responses>{
    return this.http.post<Responses>(`${this.urlBase}verifyCode`, user);
  }
  sendCodeVerify(email:any): Observable<Responses>{
    return this.http.post<Responses>(`${this.urlBase}send-code-verify`, email);
  }
  
  //ENVIAR CORREO PARA RECUPERAAR CONTRASEÑA
  sendRecoverPasswordCode(email:any): Observable<Responses>{
    return this.http.post<Responses>(`${this.urlBase}send-recover-password-code`, email);
  }
  
  isLoggedIn(): boolean {
    //console.log(this.cookies.get('token'))
    return !!this.cookies.get('token');
  }

  isLogin(token:string) {
    this.cookies.set('token', token, { path: '/' });
    console.log(this.cookies.get('token'))
  }

  logout() {
    this.cookies.delete('token', '/');
  this.cookies.delete('token');

  console.log('Token después de logout:', this.cookies.get('token'));
  } 
}
