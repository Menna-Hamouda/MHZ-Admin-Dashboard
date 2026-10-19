
import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService, ApiUser } from '../../../core/services/users';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [DatePipe, RouterLink],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css'
})
export class UserDetails implements OnInit {
  private readonly usersService = inject(UsersService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  user: ApiUser | null = null;
  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage = 'Invalid user ID.';
      return;
    }

    this.isLoading = true;

    this.usersService.getUserById(id).subscribe({
      next: user => {
        this.user = user;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load user details.';
        this.isLoading = false;
      }
    });
  }

  editUser(): void {
    if (this.user) {
      this.router.navigate(['/users', this.user.id, 'edit']);
    }
  }
}
