import { Component } from '@angular/core';
import {QueryTabComponent} from '../tab/query-tab/query-tab.component'

@Component({
  selector: 'tab-content',
  directives: [QueryTabComponent],
  template: `
    <query-tab></query-tab>
  `
})
export class TabContentComponent { }