
import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UsersService, UserPayload } from '../../../core/services/users';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css'
})
export class UserForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly usersService = inject(UsersService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  userId: number | null = null;
  isLoading = false;
  isSaving = false;
  errorMessage = '';

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    role: ['Employee', Validators.required],
    status: ['Active', Validators.required],
    password: ['', Validators.required]
  });

  ngOnInit(): void {
    const idValue = this.route.snapshot.paramMap.get('id');

    if (idValue) {
      this.userId = Number(idValue);

      if (!Number.isInteger(this.userId) || this.userId <= 0) {
        this.errorMessage = 'Invalid user ID.';
        return;
      }

      this.form.controls.password.clearValidators();
      this.form.controls.password.updateValueAndValidity();

      this.loadUser(this.userId);
    }
  }

  private loadUser(id: number): void {
    this.isLoading = true;

    this.usersService.getUserById(id).subscribe({
      next: user => {
        this.form.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          // قيم توضيحية مؤقتة وليست صلاحيات حقيقية.
          role: id === 1 ? 'Admin' : id === 2 ? 'Manager' : 'Employee',
          status: id === 3 || id === 5 ? 'Blocked' : 'Active',
          password: ''
        });

        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load this user.';
        this.isLoading = false;
      }
    });
  }

  submit(): void {
    this.form.markAllAsTouched();

    if (this.form.invalid || this.isSaving) return;

    this.isSaving = true;
    this.errorMessage = '';

    const value = this.form.getRawValue();

    const payload: UserPayload = {
      firstName: value.firstName!.trim(),
      lastName: value.lastName!.trim(),
      email: value.email!.trim(),
      phone: value.phone!.trim(),
      role: value.role as UserPayload['role'],
      status: value.status as UserPayload['status']
    };

    if (!this.userId && value.password) {
      payload.password = value.password;
    }

    const request = this.userId
      ? this.usersService.updateUser(this.userId, payload)
      : this.usersService.createUser(payload);

    request.subscribe({
      next: () => {
        this.isSaving = false;
        this.router.navigate(['/users'], {
          state: {
            message: this.userId
              ? 'User updated successfully'
              : 'User created successfully'
          }
        });
      },
      error: () => {
        this.errorMessage = 'The request failed. Please try again.';
        this.isSaving = false;
      }
    });
  }
}
