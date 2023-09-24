import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-friend-list',
  templateUrl: './friend-list.component.html',
  styleUrls: ['./friend-list.component.css'],
})
export class FriendListComponent implements OnInit {
  isloading = false;
  formOpen = false;
  friends: String[] = [];
  users: {id: string, name: string}[] = [];

  constructor(private dashService: DashboardService, private router: Router) {}

  ngOnInit(): void {
    this.isloading = true;
    this.dashService.getFriends().subscribe((resp) => {
      this.isloading = false;
      if (resp.status) {
        this.friends = resp.details;
      }
    });
    this.dashService.getUsersToAddFriend().subscribe(resp => {
      if(resp.status){
        this.users = resp.details;
      }
    });
  }

  userSelected(event: any){
    const selectedValue = event.target.value;
    if(selectedValue){
      this.isloading = true;
      this.dashService.addFriend(selectedValue).subscribe(resp => {
        this.isloading = false;
        if(resp.status){
          this.router.navigate(['dashboard'])
        }
      });
    }
  }
}
