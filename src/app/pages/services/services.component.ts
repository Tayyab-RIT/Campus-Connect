import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent implements OnInit {
  searchTerm: string = '';
  professors: any[] = [
    {
      name: 'Dr. John Smith',
      office: 'Room 101',
      hours: 'Mon & Wed 2:00 PM - 4:00 PM',
      location: 'Engineering Building',
    },
    {
      name: 'Dr. Jane Doe',
      office: 'Room 202',
      hours: 'Tue & Thu 10:00 AM - 12:00 PM',
      location: 'Science Hall',
    },
    {
      name: 'Dr. Alice Johnson',
      office: 'Room 303',
      hours: 'Fri 1:00 PM - 3:00 PM',
      location: 'Library Annex',
    },
  ];
  filteredProfessors: any[] = [];

  ngOnInit(): void {
    // Initialize filteredProfessors with all professors
    this.filteredProfessors = [...this.professors];
  }

  filterProfessors(): void {
    const search = this.searchTerm.toLowerCase();
    this.filteredProfessors = this.professors.filter((professor) => {
      return (
        professor.name.toLowerCase().includes(search) ||
        professor.office.toLowerCase().includes(search) ||
        professor.hours.toLowerCase().includes(search) ||
        professor.location.toLowerCase().includes(search)
      );
    });
  }
}
