import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Responses } from '../interfaces/Responses';
import { CookieService } from 'ngx-cookie-service';
import { LoginResponse } from '../interfaces/Login';
import { UserMeResponse } from '../interfaces/user_me';

@Injectable({
  providedIn: 'root'
})
export class UserService {
 
  //private loggedIn = false;
  private urlBase:string
  constructor(private cookies:CookieService, private http: HttpClient) { 
    this.urlBase = `${environment.apiUrlBase}user/`
  }
  me():Observable<UserMeResponse>{
    return this.http.get<UserMeResponse>(`${this.urlBase}me`)
  }
  userInfo(id:number):Observable<UserMeResponse>{
    return this.http.get<UserMeResponse>(`${this.urlBase}${id}`)
  }
}