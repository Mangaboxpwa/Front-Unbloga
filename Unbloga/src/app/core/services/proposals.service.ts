import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Responses } from '../interfaces/Responses';
import { Manga, MangaResponse } from '../interfaces/Manga';
import { CookieService } from 'ngx-cookie-service';
import { ReviewsFromUserResponse } from '../interfaces/ReviewsFromUser';

@Injectable({
  providedIn: 'root'
})
export class ProposalsService {
  private urlBase:string
  constructor(private cookies:CookieService, private http: HttpClient) { 
    this.urlBase = `${environment.apiUrlBase}proposals/`
  }
  index(userId?: number): Observable<ReviewsFromUserResponse>{
    return this.http.get<ReviewsFromUserResponse>(userId ? `${this.urlBase}user/${userId}` : `${this.urlBase}user`);
  }
  show(id:number): Observable<MangaResponse>{
    return this.http.get<MangaResponse>(`${this.urlBase}${id}`);
  }
  store(proposal:any): Observable<Responses>{
    return this.http.post<Responses>(`${this.urlBase}`,proposal);
  }
  update(review:any, reviewId:number): Observable<Responses>{
    return this.http.put<Responses>(`${this.urlBase}${reviewId}`,review);
  }
  recentReviewsFromFollowing(): Observable<Responses>{
    return this.http.get<Responses>(`${this.urlBase}following`);
  }
  favorite(userId?: number): Observable<ReviewsFromUserResponse>{
    return this.http.get<ReviewsFromUserResponse>(userId ? `${this.urlBase}favorite/${userId}` : `${this.urlBase}favorite`);
  }
  login(user:any): Observable<Responses>{
    return this.http.post<Responses>(`${this.urlBase}login`, user);
  }
}
