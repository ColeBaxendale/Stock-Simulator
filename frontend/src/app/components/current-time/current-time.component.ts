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
