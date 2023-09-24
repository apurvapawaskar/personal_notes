import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';

export const authServiceResolver: ResolveFn<boolean> = (route, state) => {
  inject(AuthService).clearData();
  return true;
};
