import { Component } from '@angular/core';
import {NavComponent} from './nav/nav.component';
import {TabContentComponent} from './tab-content/tab-content.component';
import {TabsComponent} from './tabs/tabs.component';
import {EditorComponent} from './editor/editor.component';

@Component({
  selector: 'pg-elevator',
  directives: [NavComponent,TabContentComponent,TabsComponent,EditorComponent],
  template: `
   <nav></nav><tabs></tabs><tab-content></tab-content>
  `
})
export class PgElevatorComponent { }