import 'zone.js/dist/zone';
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: ` 
  
    <button (click)="modalOpen()">Abrir modal</button>

    <app-modal #modal>
      <div modal--content>
        <p>modal</p>
        <button (click)="modalClose()">Fechar</button>
      </div>
    </app-modal>
  `,
})
export class App {
  @ViewChild('modal') modal: ModalComponent;

  name = 'Angular';

  modalOpen() {
    this.modal.open();
  }

  modalClose() {
    this.modal.close();
  }
}

bootstrapApplication(App);
