import { Component, OnInit, Input } from '@angular/core';
import {EditorComponent} from '../../editor/editor.component'

@Component({
    selector: 'query-tab',
    template: '<editor></editor>',
    directives: [EditorComponent]
})
export class QueryTabComponent{
    
}