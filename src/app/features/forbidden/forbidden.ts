import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [RouterLink],
  template: `
    <main class="forbidden-page">
      <div class="forbidden-card">
        <span class="forbidden-code">403</span>
        <h1>Access Denied</h1>
        <p>You don't have permission to access this page.</p>
        <a routerLink="/dashboard">Back to Dashboard</a>
      </div>
    </main>
  `,
  styles: [`
    .forbidden-page {
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      background: var(--color-bg-primary);
    }

    .forbidden-card {
      width: min(100%, 440px);
      padding: 40px 28px;
      text-align: center;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
    }

    .forbidden-code {
      display: block;
      color: var(--color-danger);
      font-size: 64px;
      font-weight: 800;
    }

    .forbidden-card h1 {
      margin: 12px 0;
    }

    .forbidden-card p {
      margin-bottom: 24px;
      color: var(--color-text-secondary);
    }

    .forbidden-card a {
      display: inline-block;
      padding: 12px 18px;
      background: var(--color-primary);
      border-radius: var(--radius-md);
    }
  `]
})
export class Forbidden {}
