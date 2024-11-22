import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-tutoring',
  templateUrl: './tutoring.component.html',
  styleUrls: ['./tutoring.component.css'],
})
export class TutoringComponent implements OnInit {
  slots: any[] = []; // List of available slots
  isTutor: boolean = false; // Check if user is a tutor
  newSlot = {
    topic: '',
    date: '',
    time: '',
    duration: 0,
    max_students: 0,
  };

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.loadSlots();
    this.checkIfTutor();
  }

  // Check if the user is a tutor
  checkIfTutor() {
    this.auth.getProfile().subscribe({
      next: (profile) => {
        this.isTutor = profile.data.is_tutor;
      },
      error: (err) => console.error(err),
    });
  }

  // Become a tutor
  becomeTutor() {
    if (confirm('Are you sure you want to become a tutor?')) {
      this.auth.becomeTutor().subscribe({
        next: () => {
          this.isTutor = true;
          alert('Congratulations! You are now a tutor.');
        },
        error: (err) => {
          console.error(err);
          alert('Failed to become a tutor. Please try again.');
        },
      });
    }
  }

  // Load all available slots
  loadSlots() {
    this.auth.getUser().subscribe({
      next: (userResponse: any) => {
        const userId = userResponse.data.id; // Get the logged-in user's ID

        this.auth.getTutorSlots().subscribe({
          next: (response: { slots: any[] }) => {
            this.slots = response.slots.map((slot: any) => ({
              ...slot,
              tutor_full_name: slot.user_data?.full_name || slot.tutor_id,
              isBooked: slot.tutor_bookings?.some(
                (booking: { student_id: string }) =>
                  booking.student_id === userId
              ),
            }));
          },
          error: (err: any) => console.error('Error fetching slots:', err),
        });
      },
      error: (err: any) => console.error('Error fetching user ID:', err),
    });
  }

  // Create a new slot (only for tutors)
  createSlot() {
    this.auth.addTutorSlot(this.newSlot).subscribe({
      next: () => {
        this.loadSlots();
        this.newSlot = {
          topic: '',
          date: '',
          time: '',
          duration: 0,
          max_students: 0,
        };
        alert('Slot created successfully!');
      },
      error: (err) => {
        console.error(err);
        alert(err.error.error || 'Failed to create slot. Please try again.');
      },
    });
  }

  // Book a slot
  bookSlot(slotId: string) {
    this.auth.bookTutorSlot(slotId).subscribe({
      next: () => {
        this.loadSlots(); // Refresh slots after booking
      },
      error: (err) => console.error(err),
    });
  }
}
