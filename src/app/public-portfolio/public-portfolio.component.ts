import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-public-portfolio',
  templateUrl: './public-portfolio.component.html',
  styleUrl: './public-portfolio.component.css',
})
export class PublicPortfolioComponent implements OnInit {
  username: string = '';
  profileData: any = {};
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(private route: ActivatedRoute, private auth: AuthService) {}

  ngOnInit() {
    // Get username from route parameters
    this.route.params.subscribe((params) => {
      this.username = params['username'];
      this.fetchProfile(this.username);
    });
  }

  fetchProfile(username: string) {
    this.isLoading = true;

    this.auth.getProfileByUsername(username).subscribe({
      next: (profile) => {
        this.profileData = profile.data;

        // Ensure 'skills' and 'certifications' are arrays
        if (typeof this.profileData.skills === 'string') {
          this.profileData.skills = this.profileData.skills
            .split(',')
            .map((skill: string) => skill.trim());
        }

        if (typeof this.profileData.certifications === 'string') {
          this.profileData.certifications = this.profileData.certifications
            .split(',')
            .map((cert: string) => cert.trim());
        }

        console.log('Profile data:', this.profileData);
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        this.errorMessage =
          error.error?.message ||
          'Failed to load profile. Please try again later.';
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
