import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { emailValidator } from 'src/app/validators/emailvalidator.validator';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  isLoading = false;
  submitted = false;
  error: any = null;
  form!: FormGroup;
  private errorSub!: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.errorSub = this.authService.getErrorSub().subscribe((err) => {
      this.error = err;
      if (this.error) {
        this.isLoading = false;
        this.submitted = false;
      }
    });

    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.pattern('[a-zA-Z ]*')]
      }),
      email: new FormControl(null, {
        validators: [Validators.required, emailValidator(this.authService)],
      }),
      password: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  onSignup() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.isLoading = true;
    this.authService.signUp(this.form);
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
