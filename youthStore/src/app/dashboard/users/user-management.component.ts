/* file: src/app/dashboard/users/user-management.component.ts */
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/service/user-service';

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
            <td>{{ user.name }}</td>
            <td>{{ user.phone }}</td>
            <td>{{ user.email || 'N/A' }}</td>
            <td>
              <span
                class="badge rounded-pill"
                [class.bg-primary]="user.role === 'admin'"
                [class.bg-light]="user.role !== 'admin'"
                >{{ user.role }}</span
              >
            </td>
            <td>
              <button
                class="btn btn-sm btn-primary me-2"
                (click)="toggleRole(user)"
                [disabled]="user._id === currentUserId"
              >
                {{ user.role === 'admin' ? 'Make User' : 'Make Admin' }}
              </button>
              <button
                class="btn btn-sm btn-light text-danger rounded-circle"
                (click)="deleteUser(user._id)"
                [disabled]="user.role === 'admin' && user.email === 'asmaaahmed29699@gmail.com'"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);
  users: any[] = [];
  currentUserId: string | null = null;

  ngOnInit(): void {
    this.loadCurrentUserId();
    this.loadUsers();
  }

  private loadCurrentUserId(): void {
    this.userService.getMe().subscribe((res: any) => {
      this.currentUserId = res?._id ?? null;
    });
  }

  loadUsers(): void {
    this.userService
      .getAllUsers()
      .subscribe((res: { data: { users: any[] } }) => {
        this.users = res.data.users;
      });
  }

  toggleRole(user: any): void {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    this.userService.updateUser(user._id, { role: newRole }).subscribe(() => {
      this.loadUsers();
    });
  }

  deleteUser(id: string): void {
    if (confirm('Delete this user? This cannot be undone (soft‑delete).')) {
      this.userService.deleteUser(id).subscribe(() => this.loadUsers());
    }
  }
}
