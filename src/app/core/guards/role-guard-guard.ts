import { inject } from '@angular/core';
import {
  CanActivateChildFn,
  CanActivateFn,
  Router
} from '@angular/router';

import { AuthService } from '../services/auth';
import { UserRole } from '../models/auth-models';

function checkPermission(roles: UserRole[]) {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return router.createUrlTree(['/login']);
  }

  if (auth.hasRole(roles)) {
    return true;
  }

  return router.createUrlTree(['/403']);
}

export const roleGuard: CanActivateFn = (route) => {
  const roles = route.data['roles'] as UserRole[] | undefined;

  return checkPermission(roles ?? []);
};

export const roleChildGuard: CanActivateChildFn = (childRoute) => {
  const roles = childRoute.data['roles'] as UserRole[] | undefined;

  return checkPermission(roles ?? []);
};
