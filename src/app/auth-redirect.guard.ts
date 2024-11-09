import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';

export const authRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject AuthService
  const router = inject(Router); // Inject Router for redirection

  if (authService.isAuthenticated()) {
    // Redirect authenticated users to the home page (or any other protected page)
    router.navigate(['/home']);
    return false;
  }
  return true;
};
