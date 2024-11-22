import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service'; // Adjust the path based on your directory structure

@Component({
  selector: 'app-main-nav-bar',
  templateUrl: './main-nav-bar.component.html',
  styleUrls: ['./main-nav-bar.component.css'],
})
export class MainNavBarComponent {
  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout(); // Assuming logout method is defined in AuthService
  }
}
