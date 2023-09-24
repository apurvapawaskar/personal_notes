import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

declare const window: any;

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  @Output() closeModal = new EventEmitter<{ id: string | undefined }>();
  isLoading: boolean = false;
  modal: any;

  constructor(private dashService: DashboardService) {}

  ngOnInit(): void {}

  showModal() {
    this.modal.show();
  }

  createModal(id: string) {
    let modalElem = this.getModal();

    // Init the modal if it hasn't been already.
    if (!modalElem) {
      modalElem = this.initModal();
    }

    const html =
      '<div class="modal-header">' +
      '<h5 class="modal-title mx-auto">Delete Note ?</h5>' +
      '</div>' +
      '<div class="modal-footer ">' +
      '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>' +
      '<button type="button" class="btn btn-danger" (click)="deleteNote(' +
      id +
      ')">Delete</button>' +
      '</div>';

    const modalContent = document.createElement('div');
    modalContent.className = "modal-content";

    let elemDiv = document.createElement('div');
    elemDiv.className = "modal-header";

    let elemInner = document.createElement('h5');
    elemInner.className = "modal-title mx-auto";
    elemInner.innerHTML = "Delete Note ?";
    elemDiv.appendChild(elemInner);
    modalContent.appendChild(elemDiv);

    elemDiv = document.createElement('div');
    elemDiv.className = "modal-footer justify-content-around";

    let elem = document.createElement('button');
    elem.type = 'button';
    elem.className = "btn btn-secondary"
    elem.setAttribute('data-bs-dismiss', 'modal');
    elem.innerHTML = "Cancel";
    elemDiv.appendChild(elem);

    elem = document.createElement('button');
    elem.className = "btn btn-danger"
    elem.addEventListener('click', this.deleteNote.bind(this,id));
    elem.innerHTML = "Delete";
    elemDiv.appendChild(elem);
    modalContent.appendChild(elemDiv);



    let modalAdded = false;
    // do {
      modalAdded = this.setModalContent(modalContent);
    // } while (!modalAdded);

    this.modal = new window.bootstrap.Modal(
      document.getElementById('deleteModal')
    );

    // Show the modal.
    return true;
  }

  getModal() {
    return document.getElementById('deleteModal');
  }

  setModalContent(html: any) {
    const elem = this.getModal();
    let success = false;
    if (elem) {
      const contentBody = elem.getElementsByClassName('modal-dialog');
      if (contentBody.length) {
        contentBody[0].appendChild(html);
        success = true;
      }
    }

    return success;
  }

  initModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.setAttribute('id', 'deleteModal');
    modal.setAttribute('tabindex', '-1');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="modal-dialog modal-dialog-centered" role="document">' +
      '<div class=""></div>' +
      '</div>';
    document.body.appendChild(modal);
    return modal;
  }

  deleteNote(id: string | undefined) {
    this.closeModal.emit({ id });
  }

  destroyModal() {
    this.modal.hide();
    document.getElementById('deleteModal')?.remove();
  }
}
