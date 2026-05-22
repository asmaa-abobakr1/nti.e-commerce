import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/service/auth-service';

interface SignupForm {
  name: string;
  phone: string;
  password: string;
  gender: 'male' | 'female';
  email: string;
  acceptsEmails: boolean;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userData: SignupForm = {
    name: '',
    phone: '',
    password: '',
    gender: 'male',
    email: '',
    acceptsEmails: false
  };

  error: string = '';

  signup() {
    this.authService.signup(this.userData).subscribe({
      next: () => {
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => this.error = err.error?.message || 'Signup failed'
    });
  }
}
