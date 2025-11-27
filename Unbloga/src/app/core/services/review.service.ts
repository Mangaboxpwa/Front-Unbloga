import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Responses } from '../interfaces/Responses';
import { Manga, MangaResponse } from '../interfaces/Manga';
import { Mangas, MangasResponse } from '../interfaces/Mangas';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private urlBase:string
  constructor(private cookies:CookieService, private http: HttpClient) { 
    this.urlBase = `${environment.apiUrlBase}review/`
  }
  index(): Observable<MangasResponse>{
    return this.http.get<MangasResponse>(`${this.urlBase}`);
  }
  show(id:number): Observable<MangaResponse>{
    return this.http.get<MangaResponse>(`${this.urlBase}${id}`);
  }
  store(review:any): Observable<Responses>{
    return this.http.post<Responses>(`${this.urlBase}`,review);
  }
  update(review:any, reviewId:number): Observable<Responses>{
    return this.http.put<Responses>(`${this.urlBase}${reviewId}`,review);
  }
  login(user:any): Observable<Responses>{
    return this.http.post<Responses>(`${this.urlBase}login`, user);
  }
}
