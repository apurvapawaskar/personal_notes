import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Frontend';
  private authCheck!: Subscription;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authCheck = this.authService.getAuthStatusListener().subscribe(status => {
      if(status){
        this.router.navigate(['dashboard']);
      } else {
        this.router.navigate(['']);        
      }
    });
    this.authService.autoLogin();
    
    
  }

  ngOnDestroy(): void {
      this.authCheck.unsubscribe()
  }
}
