import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.css'] 
})


export class ListingComponent implements OnInit {
  people: Person[] = [
    { name: 'John Doe', position: 'Manager', office: 'Kronberg', age: 40, startDate: '2021-01-15', salary: 75000 },
    { name: 'Jane Smith', position: 'Developer', office: 'New York', age: 30, startDate: '2019-06-22', salary: 85000 },
    { name: 'Emma Johnson', position: 'Designer', office: 'San Francisco', age: 27, startDate: '2020-03-14', salary: 68000 },
    { name: 'Michael Brown', position: 'Support', office: 'London', age: 35, startDate: '2018-11-05', salary: 54000 },
    { name: 'Emily Davis', position: 'Marketing', office: 'Berlin', age: 29, startDate: '2022-04-18', salary: 62000 },
    { name: 'David Wilson', position: 'Manager', office: 'Kronberg', age: 42, startDate: '2017-09-30', salary: 78000 },
    { name: 'Sophia Martinez', position: 'HR', office: 'Madrid', age: 33, startDate: '2020-01-10', salary: 60000 },
    { name: 'James Anderson', position: 'Developer', office: 'New York', age: 28, startDate: '2021-08-20', salary: 88000 },
    { name: 'Olivia Lee', position: 'Designer', office: 'San Francisco', age: 26, startDate: '2019-05-17', salary: 70000 },
    { name: 'William Harris', position: 'Support', office: 'London', age: 31, startDate: '2018-07-23', salary: 56000 },
    { name: 'Emma Johnson', position: 'Designer', office: 'San Francisco', age: 27, startDate: '2020-03-14', salary: 68000 },
    { name: 'Michael Brown', position: 'Support', office: 'London', age: 35, startDate: '2018-11-05', salary: 54000 },
    { name: 'Emily Davis', position: 'Marketing', office: 'Berlin', age: 29, startDate: '2022-04-18', salary: 62000 },
    { name: 'David Wilson', position: 'Manager', office: 'Kronberg', age: 42, startDate: '2017-09-30', salary: 78000 }
]
constructor() {}

  ngOnInit(): void {}
}

export interface Person {
  name: string;
  position: string
  office: string
  age: number;
  startDate: string;
  salary: number;

}