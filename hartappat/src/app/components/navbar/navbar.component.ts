import { Component } from '@angular/core';
import {interval, of, timestamp} from "rxjs";
import {map} from "rxjs/operators";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  {

  // This class had both a constructor() and an ngOnInit(). Now removed.

  protected readonly statusText = interval(1000)
    .pipe(
      map(() => this.getCurrentTime()),
      map(t => 'Time and status indicator: ' + t)
    );

  private getCurrentTime(): string {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }
}
