import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.sass'
})
export class ForgotPasswordComponent {
   userEmail: '' | undefined

  requestPasswordReset(): void {
    // this.userService.requestPasswordReset(this.userEmail).subscribe({
    //   next: () => {
    //     // Inform the user to check their email
    //   },
    //   error: (error) => {
    //     // Handle errors (e.g., user not found)
    //   }
    // });
  }
}
