import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Responses } from '../interfaces/Responses';
import { Manga, MangaResponse } from '../interfaces/Manga';
import { Mangas, MangasResponse } from '../interfaces/Mangas';
import { CookieService } from 'ngx-cookie-service';
import { ReviewsFromUserResponse } from '../interfaces/ReviewsFromUser';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private urlBase:string
  constructor(private cookies:CookieService, private http: HttpClient) { 
    this.urlBase = `${environment.apiUrlBase}follows/`
  }
  followers(userId?: number): Observable<Responses>{
    return this.http.get<Responses>(userId ? `${this.urlBase}followers/${userId}` : `${this.urlBase}followers`);
  }
  following(userId?: number): Observable<Responses>{
    return this.http.get<Responses>(userId ? `${this.urlBase}following/${userId}` : `${this.urlBase}following`);
  }
  store(review:any): Observable<Responses>{
    return this.http.post<Responses>(`${this.urlBase}`,review);
  }
  update(review:any, reviewId:number): Observable<Responses>{
    return this.http.put<Responses>(`${this.urlBase}${reviewId}`,review);
  }
}
