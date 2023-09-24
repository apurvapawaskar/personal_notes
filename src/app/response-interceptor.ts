import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, map, tap } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { DashboardService } from './dashboard/dashboard.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor(
    private authservice: AuthService,
    private dashService: DashboardService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap((event) => {
        if (event instanceof HttpResponse) {
          
        }
      }),
      catchError((err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          // If Invalid Token
          if (err.status == 401) {
            this.authservice.clearData();
            this.router.navigate(['/'], { skipLocationChange: true });
          }
          console.log(err)
          if (err.error.message !== "") {
            // Server Sent Error
            this.authservice.emitError(err.error.message);
          } else {
            this.authservice.emitError(err.statusText);
          }
        }

        return of(err.error.error);
      })
    );
  }
}
