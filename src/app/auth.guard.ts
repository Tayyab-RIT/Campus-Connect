import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inject AuthService
  const router = inject(Router); // Inject Router for redirection

  if (authService.isAuthenticated()) {
    return true; // Allow access if authenticated
  } else {
    router.navigate(['/sign-in']); // Redirect to sign-in if not authenticated
    return false; // Deny access
  }
};
