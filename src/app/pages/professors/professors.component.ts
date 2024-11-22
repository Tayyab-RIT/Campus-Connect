import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-professors',
  templateUrl: './professors.component.html',
  styleUrls: ['./professors.component.css'],
})
export class ProfessorsComponent implements OnInit {
  studentName: string = ''; // Store the student's name
  studentEmail: string = ''; // Store the student's email
  searchTerm: string = '';
  professors = [
    {
      name: 'Dr. Manisha Kankarej',
      office: 'B-205',
      email: 'mnkcad@rit.edu',
      hours: [
        { day: 'Monday & Wednesday', time: '10:00 AM – 12:00 PM' },
        { day: 'Tuesday & Thursday', time: '1:00 PM – 1:30 PM' },
      ],
      location: 'Block B, 2nd Floor',
    },
    {
      name: 'Dr. Adrianne Calfo-Kalfopoulou',
      office: 'B213',
      email: 'axccad1@rit.edu',
      hours: [
        {
          day: 'Monday & Wednesday',
          time: '11:00 AM – 12:00 PM, 3:00 PM – 4:00 PM',
        },
        { day: 'Tuesday & Thursday', time: '11:00 AM – 12:00 PM' },
      ],
      location: 'Block B, 2nd Floor',
    },
    {
      name: 'Dr. Wesam Almobaideen',
      office: 'D205',
      email: 'wxacad@rit.edu',
      hours: [
        { day: 'Monday & Wednesday', time: '11:00 AM – 12:00 PM' },
        { day: 'Tuesday', time: '12:00 PM – 1:00 PM, 5:00 PM – 6:00 PM' },
      ],
      location: 'Block D, 2nd Floor',
    },
    {
      name: 'Dr. Ali ASSI',
      office: 'D206',
      email: 'axacad5@rit.edu',
      hours: [
        { day: 'Monday', time: '11:00 AM – 12:00 PM, 1:00 PM – 2:30 PM' },
        { day: 'Wednesday', time: '1:00 PM – 2:30 PM' },
      ],
      location: 'Block D, 2nd Floor',
    },
    {
      name: 'Dr. Zainab Al-Zanbouri',
      office: 'D-005',
      email: 'zxacad@rit.edu',
      hours: [
        { day: 'Monday', time: '10:00 AM – 12:00 PM' },
        { day: 'Wednesday', time: '10:00 AM – 12:00 PM' },
      ],
      location: 'Block D, Ground Floor',
    },
    {
      name: 'Dr. Kevser Ovaz Akpinar',
      office: 'D-203',
      email: 'kxocad1@rit.edu',
      hours: [
        { day: 'Monday & Wednesday', time: '11:00 AM – 12:00 PM' },
        { day: 'Thursday', time: '10:30 AM – 11:30 AM' },
      ],
      location: 'Block D, 2nd Floor',
    },
  ];

  filteredProfessors: any[] = [];

  ngOnInit(): void {
    // Initialize filteredProfessors with all professors
    this.filteredProfessors = [...this.professors];
    this.loadStudentProfile();
  }

  constructor(private auth: AuthService) {}

  loadStudentProfile(): void {
    this.auth.getProfile().subscribe({
      next: (response) => {
        this.studentName = response.data.full_name;
        this.studentEmail = response.data.email; // Assuming `email` is in the response
        console.log('Student Profile:', response);
      },
      error: (err) => {
        console.error('Failed to load student profile:', err);
      },
    });
  }

  filterProfessors(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredProfessors = this.professors.filter((professor) => {
      const hoursAsText = professor.hours
        .map((hour: any) => `${hour.day} ${hour.time}`)
        .join(' ');
      return (
        professor.name.toLowerCase().includes(search) ||
        professor.office.toLowerCase().includes(search) ||
        hoursAsText.toLowerCase().includes(search) ||
        professor.location.toLowerCase().includes(search) ||
        professor.email.toLowerCase().includes(search)
      );
    });
  }

  scheduleMeeting(professor: any): void {
    const subject = `Request for Meeting with ${professor.name}`;
    const body = `Dear ${professor.name},\n\nThis is ${
      this.studentName
    }, and I would like to request a meeting during your office hours.\n\nOffice: ${
      professor.office
    }\nLocation: ${professor.location}\nAvailable Hours: ${professor.hours.map(
      (hour: any) => `${hour.day}: ${hour.time}`
    )}.\n\nThank you.\n\nBest regards,\n${this.studentName}`;

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${
      professor.email
    }&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = gmailUrl;
  }
}
