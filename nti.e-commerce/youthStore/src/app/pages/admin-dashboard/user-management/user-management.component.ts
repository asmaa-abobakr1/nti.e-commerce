import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 class="fw-bold mb-4">Users Management</h3>
    <div class="table-responsive">
      <table class="table align-middle">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>{{user.name}}</td>
            <td>{{user.phone}}</td>
            <td>{{user.email || 'N/A'}}</td>
            <td>
              <span class="badge rounded-pill" [class.bg-primary]="user.role === 'admin'" [class.bg-light]="user.role !== 'admin'">
                {{user.role}}
              </span>
            </td>
            <td>
              <button class="btn btn-sm btn-light text-danger rounded-circle" (click)="deleteUser(user._id)" [disabled]="user.role === 'admin' && user.email === 'asmaaahmed29699@gmail.com'">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class UserManagementComponent implements OnInit {
  userService = inject(UserService);
  users: any[] = [];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(res => this.users = res.data.users);
  }

  deleteUser(id: string) {
    if (confirm('Delete this user? This cannot be undone (it will be soft-deleted).')) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}
