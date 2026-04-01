import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  protected email: string= '';
  protected password: string= '';
  protected error: boolean = false;

  constructor(private readonly authService:AuthService,
              private readonly router: Router,) {
  }

  login() {

    this.authService.login(this.email, this.password)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          this.error = true;
        }
      })
  }

}
