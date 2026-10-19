
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  UsersService,
  ApiUser,
  User,
  UserRole,
  UserStatus
} from '../../../core/services/users';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './users-list.html',
  styleUrl: './users-list.css'
})
export class UsersList implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly router = inject(Router);

  users: User[] = [];
  searchTerm = '';
  selectedRole = 'All';
  selectedStatus = 'All';

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  openMenuId: number | null = null;
  userToDelete: User | null = null;
  isDeleting = false;

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.usersService.getUsers().subscribe({
      next: (apiUsers) => {
        this.users = apiUsers.map(user => ({
          ...user,
          role: this.demoRole(user.id),
          status: this.demoStatus(user.id)
        }));

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load users. Please try again.';
        this.isLoading = false;
      }
    });
  }

  private demoRole(id: number): UserRole {
    if (id === 1) return 'Admin';
    if (id === 2 || id === 4) return 'Manager';
    return 'Employee';
  }

  private demoStatus(id: number): UserStatus {
    return id === 3 || id === 5 ? 'Blocked' : 'Active';
  }

  get filteredUsers(): User[] {
    const term = this.searchTerm.trim().toLowerCase();

    return this.users.filter(user => {
      const name = `${user.firstName} ${user.lastName}`.toLowerCase();

      const matchesSearch =
        name.includes(term) ||
        user.email.toLowerCase().includes(term);

      const matchesRole =
        this.selectedRole === 'All' ||
        user.role === this.selectedRole;

      const matchesStatus =
        this.selectedStatus === 'All' ||
        user.status === this.selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  toggleMenu(id: number): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  viewUser(id: number): void {
    this.openMenuId = null;
    this.router.navigate(['/users', id]);
  }

  editUser(id: number): void {
    this.openMenuId = null;
    this.router.navigate(['/users', id, 'edit']);
  }

  askDelete(user: User): void {
    this.openMenuId = null;
    this.userToDelete = user;
  }

  cancelDelete(): void {
    this.userToDelete = null;
  }

  confirmDelete(): void {
    if (!this.userToDelete || this.isDeleting) return;

    const user = this.userToDelete;
    this.isDeleting = true;
    this.errorMessage = '';

    this.usersService.deleteUser(user.id).subscribe({
      next: () => {
        this.users = this.users.filter(item => item.id !== user.id);
        this.userToDelete = null;
        this.isDeleting = false;
        this.successMessage = 'User deleted successfully';

        setTimeout(() => this.successMessage = '', 3000);
      },
      error: () => {
        this.errorMessage = 'Failed to delete user. Please try again.';
        this.isDeleting = false;
      }
    });
  }
}
