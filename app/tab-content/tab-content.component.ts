import { Component } from '@angular/core';
import {QueryTabComponent} from '../tab/query-tab/query-tab.component'
import {TabService} from '../tab/tab.service'

@Component({
  selector: 'tab-content',
  directives: [QueryTabComponent],
  template: `
    <query-tab data="TabService.activeTab"></query-tab>
  `
})
export class TabContentComponent {
  TabService:TabService
  constructor(){
    this.TabService = TabService
  }
}
