import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  menu_items: any;

  @Output() menuAction = new EventEmitter<{ action: number; type: string }>();

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    const menu_items_data = [
      { name: 'Listing', value: 'list', id: 1, routerLink: "dashboard" },
      { name: 'Friends', value: 'users', id: 2, routerLink: "friends" },
      { name: 'Logout', value: 'logout', id: 3 },
    ];

    this.menu_items = menu_items_data;
  }

  /**
   * 
   * @param {{ action: number; type: string }} item The item which user selects
   * Handles the user input on sidebar.
   */
  menuClicked(item: any) {
    switch (item.id) {
      case 3:
        this.authService.logout();
        break;
    }
  }
}
