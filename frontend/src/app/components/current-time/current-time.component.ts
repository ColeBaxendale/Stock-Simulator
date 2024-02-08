/**
 * Current Time Component
 * 
 * Filename: current-time.component.ts
 * Author: [Cole Baxendale]
 * Contact: [thecodercole@gmail.com]
 * Created on: [February 2024]
 * Version: 1.0
 * 
 * Description: 
 * This component displays the current time and updates it every second. It utilizes 
 * the DatePipe from the @angular/common module to format the current time in hours, 
 * minutes, seconds, and AM/PM format. The time is updated using a setInterval function 
 * that calls the updateCurrentTime() method every second to keep the displayed time 
 * current.
 * 
 * Params: None
 * Time Complexity: O(1)
 * Algorithm Strategy: The component initializes the current time as an empty string 
 * and then calls the updateCurrentTime() method to set the initial time. It uses a 
 * setInterval function to update the time every second by calling the updateCurrentTime() 
 * method. This approach ensures that the displayed time is always up-to-date.
 * 
 */

// Import statements for Angular modules
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-current-time',
  templateUrl: './current-time.component.html',
  styleUrls: ['./current-time.component.sass']
})
export class CurrentTimeComponent implements OnInit {
  currentTime: string = ''; // Initialize it as an empty string

  constructor(private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.updateCurrentTime(); // Call this method to set the initial time
    setInterval(() => this.updateCurrentTime(), 1000); // Update time every second
  }

  private updateCurrentTime() {
    const now = new Date();
    this.currentTime = this.datePipe.transform(now, 'hh:mm:ss a')!;
    // Use the non-null assertion operator (!) to indicate that this value is never null
  }
}
