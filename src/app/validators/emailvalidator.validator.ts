import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { AuthService } from '../auth/auth.service';

export function emailValidator(authService: AuthService): ValidatorFn {
  return (control: AbstractControl) => {
    const emailValid = String(control.value)
      .toLowerCase()
      .trim()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    // authService.emitError(emailValid ? "" : "Email is invalid");
    return emailValid ? null : { emailinvalid: true };
  };
}
