
import { Component } from '@angular/core';
import {ModalsService} from '../services/modals.service';
import {ModalComponent} from '../modal-components/modal.component';
import {SchemaManagerComponent} from '../modal-components/schema-manager.component';

@Component({
  selector: 'modal-frame',
  directives: [ModalComponent, SchemaManagerComponent],
  template: `<modal *ngIf="ModalsService.schemaManager">
    <schema-manager [model]="ModalsService.schemaManager"></schema-manager>
    </modal>
  `
})
export class ModalFrameComponent {
  ModalsService = ModalsService
}
