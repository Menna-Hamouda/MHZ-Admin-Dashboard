import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GeneralSettings {
  companyName: string;
  companyEmail: string;
  phone: string;
  address: string;
}

export interface ProfileSettings {
  name: string;
  email: string;
  image: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);

  private readonly apiUrl = 'https://api.example.com/settings';

  updateGeneral(
    settings: GeneralSettings
  ): Observable<GeneralSettings> {
    return this.http.put<GeneralSettings>(
      `${this.apiUrl}/general`,
      settings
    );
  }

  updateProfile(
    profile: ProfileSettings
  ): Observable<ProfileSettings> {
    return this.http.put<ProfileSettings>(
      `${this.apiUrl}/profile`,
      profile
    );
  }

  changePassword(
    request: ChangePasswordRequest
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/password`,
      request
    );
  }
}
