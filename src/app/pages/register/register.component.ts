import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  fullName: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (!this.fullName || !this.email || !this.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }
    this.authService
      .register(this.fullName, this.email, this.password)
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/home']); // Redirect after successful registration
        },
        error: (error) => {
          console.error('Registration failed', error);
          // Display a specific error message based on the backend response
          this.errorMessage =
            error.error?.error || 'Registration failed. Please try again.';
        },
      });
  }
}
