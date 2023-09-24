import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import { DashboardService } from '../dashboard.service';
import { NotesDataModel } from '../notes.model';
import { ModalComponent } from 'src/app/helperComponents/modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  @ViewChild(ModalComponent, { static: false }) modalComponent:
    | ModalComponent
    | undefined;
  notes: NotesDataModel[] = [];
  totalRecords: number = 0;
  pageSize: number = 1;
  currentPage = 0;
  pageSizeOptions = [1, 2, 5, 8, 10];
  isLoading = false;
  private noteDataSub!: Subscription;

  constructor(private dashService: DashboardService) {}

  ngOnInit(): void {
    this.noteDataSub = this.dashService.getNoteOb().subscribe((data) => {
      this.isLoading = false;
      if (data.data.length) {
        this.notes = data.data;
        this.totalRecords = data.total;
      }
    });

    this.isLoading = true;
    this.dashService.getNotesData();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.dashService.getNotesData(this.currentPage, this.pageSize);
  }

  deleteNote(id: string) {
    const modalCreated = this.modalComponent?.createModal(id);
    if (modalCreated) {
      this.modalComponent?.showModal();
    }
  }

  doDelete(event: { id: any }) {
    if (event.id) {
      this.dashService.deleteNote(event.id).subscribe((resp) => {
        if (resp.status) {
          this.modalComponent?.destroyModal();
          this.dashService.getNotesData(this.currentPage, this.pageSize);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.noteDataSub.unsubscribe();
  }
}
