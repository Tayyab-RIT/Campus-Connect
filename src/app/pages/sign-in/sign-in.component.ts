import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogIn() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Sign-in successful', response);
        this.router.navigate(['/feed/1']); // Redirect after successful sign-in
      },
      error: (error) => {
        console.error('Sign-in failed', error);
        // Display a specific error message based on the backend response
        this.errorMessage =
          error.error?.error || 'Sign-in failed. Please try again.';
      },
    });
  }
}
