import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { environment} from 'src/environments/environment.development';
import { AuthModel } from './auth.model';
import { ResponseModel } from '../response.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private errorSub = new Subject<string>();
  private authCheck = new Subject<boolean>();
  private baseUrl = environment.baseUrl;
  

  constructor(private http: HttpClient, private router: Router) {}

  getIsAuth() {
    return this.isAuthenticated;
  }

  emitError(error: string) {
    return this.errorSub.next(error);
  }

  getErrorSub() {
    return this.errorSub.asObservable();
  }

  getAuthStatusListener() {
    return this.authCheck.asObservable();
  }

  getAuthToken() {
    return this.getToken();
  }

  signUp(form: FormGroup) {
    const data: any = {};
    data['name'] = String(form.value.name).trim();
    data['email'] = String(form.value.email).trim();
    data['password'] = String(form.value.password).trim();

    this.http
      .post<ResponseModel>( this.baseUrl + '/auth/signup', data)
      .subscribe((resp) => {
        if (resp.status) {
          this.router.navigate(['/']);
        }
      });
  }

  login(email: string, password: string) {
    const data: AuthModel = {
      email: email,
      password: password,
    };
    this.http
      .post<ResponseModel>(
        this.baseUrl + '/auth/login', 
        data
      )
      .subscribe({
        next: (res) => {
          if (res.status) {
            this.isAuthenticated = true;
            this.authCheck.next(true);
            this.saveData(res.details?.token);
            this.router.navigate(['/dashboard']);
          } else {
            this.isAuthenticated = false;
            this.errorSub.next("Invalid email/password");
            this.logout();
            this.authCheck.next(false);
          }
        },
        error: (err) => {
          this.authCheck.next(false);
          this.logout();
        },
      });
  }

  logout() {
    this.isAuthenticated = false;
    this.authCheck.next(false);
    this.removeData();
    this.router.navigate(['/']);
  }

  clearData() {
    this.removeData();
    this.authCheck.next(false);
  }

  autoLogin() {
    const data = this.getData();
    let token;
    if (!data) {
      this.removeData();
      return;
    }
    const expiresIn = data.expiresIn.getTime() - Date.now();
    if (expiresIn > 0) {
      this.isAuthenticated = true;
      token = data.token;
      this.authCheck.next(true);
    }
  }

  private getData() {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');
    if (!token || !expiresIn) {
      return;
    }
    return {
      token: token,
      expiresIn: new Date(+expiresIn),
    };
  }

  private saveData(token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', (Date.now() + 3600000).toString());
  }

  private removeData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  private getToken() {
    return localStorage.getItem('token');
  }
}
