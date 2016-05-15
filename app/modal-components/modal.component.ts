import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core'
import {ModalsService} from '../services/modals.service';

@Component({
    selector: 'modal',
    template: `<div class="modal-content"><h3 class='modal-close'><i class='fa fa-close' (click)='close()'></i></h3><ng-content></ng-content></div>`,
    styles: [`
        :host-context { content: ''; position: fixed; background: rgba(0,0,0,.5); left: 0; top: 0; bottom: 0;
            right: 0; z-index: 5; }
        :host-context .modal-content {position: absolute; left: 50px; top: 50px; background: white; padding: 10px; 
            box-shadow: 0 1px 10px rgba(0,0,0,.5); }
            .modal-close{text-align:right;}
    `]
})
export class ModalComponent {
    close(){ModalsService.schemaManager=null;}
}
