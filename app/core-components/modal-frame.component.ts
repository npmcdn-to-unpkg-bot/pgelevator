
import { Component } from '@angular/core';
import {ModalsService} from '../services/modals.service';
import {ModalComponent} from '../modal-components/modal.component';
import {SchemaManagerComponent} from '../modal-components/schema-manager.component';
import {LoginComponent} from "../modal-components/login.component";

@Component({
  selector: 'modal-frame',
  directives: [ModalComponent, SchemaManagerComponent,LoginComponent],
  template: `<modal *ngIf="ModalsService.schemaManager">
    <schema-manager [model]="ModalsService.schemaManager"></schema-manager>
    </modal>
    
    <login *ngIf="ModalsService.login"></login>
  `
})
export class ModalFrameComponent {
  ModalsService = ModalsService
}
