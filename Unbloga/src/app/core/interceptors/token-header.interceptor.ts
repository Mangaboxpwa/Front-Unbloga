import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const tokenHeaderInterceptor: HttpInterceptorFn = (req, next) => {
  const cookie = inject(CookieService);
  let token = cookie.get('token');
  const authReq = req.clone({
  setHeaders:{
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  }
});

  return next(authReq);
};
