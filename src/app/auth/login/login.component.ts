import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
// import { emailValidator } from 'src/app/validators/emailvalidator.validator';
import { AuthService } from '../auth.service';
import { emailValidator } from 'src/app/validators/emailvalidator.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
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
      email: new FormControl(null, {
        validators: [Validators.required, emailValidator(this.authService)],
      }),
      password: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  onLogin() {
    if (this.form.invalid) return;
    this.submitted = true;
    this.isLoading = true;
    const email = this.form.value.email;
    const password = this.form.value.password;
    this.authService.login(email, password);
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
