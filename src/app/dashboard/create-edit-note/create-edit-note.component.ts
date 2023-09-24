import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotesDataModel } from '../notes.model';
import { DashboardService } from '../dashboard.service';
import { AuthService } from 'src/app/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-create-edit-note',
  templateUrl: './create-edit-note.component.html',
  styleUrls: ['./create-edit-note.component.css'],
})
export class CreateEditNoteComponent implements OnInit, OnDestroy {
  noteId = "";
  editMode = false;
  noteData!: NotesDataModel;
  form!: FormGroup;
  submitted = false;
  isLoading = false;
  error: any = null;
  private errorSub!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit(): void {
    let params = this.activatedRoute.snapshot.params;
    if (params?.['id']) {
      this.noteId = params['id'];
      this.editMode = true;
      this.noteData = this.dashboardService.getNoteDataById(this.noteId);
    }

    this.errorSub = this.authService.getErrorSub().subscribe((err) => {
      this.error = err;
      if (this.error) {
        this.isLoading = false;
        this.submitted = false;
      }
    });

    this.form = new FormGroup({
      title: new FormControl(this.editMode ? this.noteData?.title : null, {
        validators: [Validators.required],
      }),
      data: new FormControl(this.editMode ? this.noteData?.data : null, {
        validators: [Validators.required],
      }),
    });
  }

  doAction() {
    if (!this.form.valid) return;

    this.submitted = true;
    if (this.editMode) {
      this.dashboardService.editNote({
        ...this.noteData,
        title: this.form.get('title')?.value,
        data: this.form.get('data')?.value,
      });
    } else {
      this.dashboardService.createNote({
        title: this.form.get('title')?.value,
        data: this.form.get('data')?.value,
      }).subscribe(resp => {
        if(resp.status){
          // this.noteData.next({data: [...this.notes], total: this.notes.length});
          this.router.navigate(['/dashboard']);
        }else {
          this.authService.emitError(resp.message);
        }
      });;
    }
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }
}
