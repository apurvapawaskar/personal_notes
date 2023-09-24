import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotesDataModel } from './notes.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.development';
import { ResponseModel } from '../response.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private notes: NotesDataModel[] = [];
  private baseUrl = environment.baseUrl;

  notesDataSubject = new Subject<{ data: NotesDataModel[]; total: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getProfile() {
    return this.http.get<ResponseModel>(this.baseUrl + '/profile');
  }

  getNoteOb() {
    return this.notesDataSubject.asObservable();
  }

  getNotesData(offset: number = 0, limit: number = 1) {
    return this.http
      .get<ResponseModel>(this.baseUrl + '/notes', {
        params: { offset, limit },
      })
      .subscribe((data) => {
        if (data.status) {
          this.notes = data.details.data;
          this.notesDataSubject.next({
            data: [...this.notes],
            total: data.details.total,
          });
        } else {
          this.notesDataSubject.next({
            data: [],
            total: 0,
          });
        }
      });
  }

  getNoteDataById(id: string): NotesDataModel {
    const note = this.notes.filter((note) => note.id == id);
    if (!note.length) {
      this.router.navigate(['/dashboard']);
    }
    return note[0];
  }

  createNote(note: { title: string; data: string }) {
    return this.http.post<ResponseModel>(this.baseUrl + '/notes', {
      title: note.title,
      data: note.data,
    });
  }

  editNote(enote: NotesDataModel) {
    this.http
      .put<ResponseModel>(this.baseUrl + '/notes', enote)
      .subscribe((resp) => {
        if (resp.status) {
          // this.notes = this.notes.map(note => {
          //   return note.id == enote.id ? enote : note
          // });
          // this.notesDataSubject.next({data: [...this.notes], total: this.notes.length});
          this.router.navigate(['/dashboard']);
        }
      });
  }

  deleteNote(id: string) {
    return this.http.delete<ResponseModel>(this.baseUrl + '/notes/' + id);
  }

  getFriends() {
    return this.http.get<ResponseModel>(this.baseUrl + '/friends');
  }

  getUsersToAddFriend() {
    return this.http.get<ResponseModel>(this.baseUrl + '/friends/users');
  }

  addFriend(id: string) {
    return this.http.post<ResponseModel>(this.baseUrl + '/friends', { id });
  }
}
