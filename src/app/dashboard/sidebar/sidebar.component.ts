import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AuthService } from 'src/app/auth/auth.service';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  menu_items: any;
  userName = 'John Doe';

  @Output() menuAction = new EventEmitter<{ action: number; type: string }>();

  constructor(
    private dashService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.dashService.getProfile().subscribe((resp) => {
      if (resp.status) {
        this.userName = resp.details.name;
      }
    });

    const menu_items_data = [
      { name: 'Listing', value: 'list', id: 1, routerLink: '/' },
      { name: 'Friends', value: 'users', id: 2, routerLink: 'friends' },
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
