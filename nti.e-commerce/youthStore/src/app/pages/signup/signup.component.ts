import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  authService = inject(AuthService);
  router = inject(Router);

  userData = {
    name: '',
    phone: '',
    password: '',
    gender: 'male',
    email: ''
  };

  error: string = '';

  signup() {
    this.authService.signup(this.userData).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => this.error = err.error.message || 'Signup failed'
    });
  }
}
