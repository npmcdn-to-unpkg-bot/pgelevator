/**
 * Created by francisco on 14/05/16.
 */
import { Component } from '@angular/core'

@Component({
    selector: 'modal',
    template: `
        <modal>
            <ng-content></ng-content>
        </modal>
    `,
    styles: [`
        
    `]
})
export class Modal {

}
