import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  profileData: any = {}; // Holds user profile data
  isLoading: boolean = true; // Loader state
  isSaving: boolean = false; // Save button state
  userId: string = ''; // Current user's ID
  errorMessage: string = ''; // Error message

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.isLoading = true; // Set loading state
    this.authService.getProfile().subscribe({
      next: (profile) => {
        this.profileData = profile.data; // Populate profile data
        console.log('Profile fetched successfully:', profile);
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        this.errorMessage =
          error.error?.message ||
          'Failed to load profile. Please try again later.';
      },
      complete: () => {
        this.isLoading = false; // Turn off loading state
      },
    });
  }

  saveProfile() {
    console.log('Profile saved');
  }
}
