import {Component} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {AuthService} from "../../../services/auth.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-change-password',
  imports: [
    MatButton,
    FormsModule
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent {
  protected currentPassword: string = '';
  protected newPassword: string = '';
  protected confirmNewPassword: string = '';
  protected warning401: boolean = false;
  protected warning403: boolean = false;
  protected showSuccess: boolean = false;

  constructor(private readonly authService: AuthService,) {
  }

  changePassword() {
    this.authService.changePassword(this.currentPassword, this.newPassword)
      .subscribe(
        {
          next: (ok) => {
            this.warning401 = false;
            this.warning403 = false;
            this.showSuccess = true;
          },
          error: (err) => {

            if (err.status === 401) {
              this.warning401 = true;
            }

            if (err.status === 403) {
              this.warning403 = true;
            }
          }
        }
      )
  }

  protected isDisabled() {
    const empty = this.newPassword.length < 1;
    const tooShort = this.newPassword.length < 4;
    const nonMatching = !this.isMatching();
    if (empty || tooShort || nonMatching)
      return true;
    return false;
  }

  protected isMatching() {
    return this.newPassword == this.confirmNewPassword;
  }
}
