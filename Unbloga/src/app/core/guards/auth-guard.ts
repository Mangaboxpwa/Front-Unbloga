// auth.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Auth } from '../services/auth';
import { NavigationService } from '../services/navigation.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(Auth);

  const loggedIn = authService.isLoggedIn(); // boolean

  if (loggedIn) {
    router.navigate(['/tab3']);
    return false; // bloquea login y register
  }

  return true; // permite entrar si NO está logueado
};
