/**
 * Created by francisco on 14/05/16.
 */
import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core'

@Component({
    selector: 'modal',
    template: `
        <div class="modal-content"><ng-content></ng-content></div>
    `,
    styles: [`
        :host-context { content: ''; position: fixed; background: rgba(0,0,0,.5); left: 0; top: 0; bottom: 0;
            right: 0; z-index: 5; }
        :host-context .modal-content {position: absolute; left: 50px; top: 50px; background: white; padding: 10px; 
            box-shadow: 0 1px 10px rgba(0,0,0,.5); }
            
    `]
})
export class ModalComponent implements OnInit{

    constructor(private ref: ElementRef){}

    ngOnInit() {
        this.ref.nativeElement
    }
}
