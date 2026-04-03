import {Component} from '@angular/core';
import {interval} from "rxjs";
import {map} from "rxjs/operators";
import {AsyncPipe} from "@angular/common";
import {Router, RouterModule} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {AuthService} from "../../services/auth.service";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [AsyncPipe, RouterModule, MatButton, MatIcon],
})
export class NavbarComponent {

  constructor(protected readonly authService: AuthService,
              private readonly router: Router,
              ) {}

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

  protected logout() {
    this.authService.logout()
      .subscribe({
        next: () => {
          void this.router.navigate(['/login']);
        },
        error: () => {
          console.error('Logout failed');
        }
      })
  }
}
