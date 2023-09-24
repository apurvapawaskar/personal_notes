import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './dashboard/home/home.component';
import { CreateEditNoteComponent } from './dashboard/create-edit-note/create-edit-note.component';
import { AuthGuard } from './auth/auth.guard';
import { SignupComponent } from './auth/signup/signup.component';
import { FriendListComponent } from './dashboard/friend-list/friend-list.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'note', component: CreateEditNoteComponent },
      { path: 'friends', component: FriendListComponent },
    ],
  },
  { path: '**', redirectTo: '/dashboard/friends' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
