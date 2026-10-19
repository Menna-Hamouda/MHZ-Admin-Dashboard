import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  SettingsService
} from '../../core/services/settings';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  activeTab = signal<'general' | 'profile' | 'security'>('general');
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  selectedImage = signal<File | null>(null);
  imagePreview = signal('');

  generalForm = this.fb.nonNullable.group({
    companyName: ['MHZ Company', Validators.required],
    companyEmail: [
      'company@example.com',
      [Validators.required, Validators.email]
    ],
    phone: ['', Validators.required],
    address: ['', Validators.required]
  });

  profileForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  securityForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required]
  });

  setTab(tab: 'general' | 'profile' | 'security'): void {
    this.activeTab.set(tab);
    this.clearMessages();
  }

  private clearMessages(): void {
    this.successMessage.set('');
    this.errorMessage.set('');
  }

  saveGeneral(): void {
    this.clearMessages();

    if (this.generalForm.invalid) {
      this.generalForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    this.settingsService
      .updateGeneral(this.generalForm.getRawValue())
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.successMessage.set('Settings updated successfully');
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set(
            'Unable to save settings. Check your backend connection.'
          );
        }
      });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMessage.set('Please select a valid image file.');
      input.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.errorMessage.set('Image size must be 2 MB or less.');
      input.value = '';
      return;
    }

    this.clearMessages();

    this.selectedImage.set(file);

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview.set(String(reader.result ?? ''));
    };

    reader.readAsDataURL(file);
  }

  saveProfile(): void {
    this.clearMessages();

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);

    const profile = {
      ...this.profileForm.getRawValue(),
      image: this.imagePreview()
    };

    this.settingsService.updateProfile(profile).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('Profile updated successfully');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set(
          'Unable to update profile. Check your backend connection.'
        );
      }
    });
  }

  changePassword(): void {
    this.clearMessages();

    if (this.securityForm.invalid) {
      this.securityForm.markAllAsTouched();
      return;
    }

    const {
      currentPassword,
      newPassword,
      confirmPassword
    } = this.securityForm.getRawValue();

    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      return;
    }

    if (currentPassword === newPassword) {
      this.errorMessage.set(
        'New password must be different from current password.'
      );
      return;
    }

    this.loading.set(true);

    this.settingsService.changePassword({
      currentPassword,
      newPassword
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.securityForm.reset();
        this.successMessage.set('Password changed successfully');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set(
          'Unable to change password. Check your current password and backend connection.'
        );
      }
    });
  }
}
