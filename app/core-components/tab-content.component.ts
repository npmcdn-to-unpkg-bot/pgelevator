import { Component } from '@angular/core';
import {TabService} from '../services/tab.service'

@Component({
  selector: 'tab-content',
  directives: [],
  template: `
  `
})
export class TabContentComponent {
  TabService:TabService
  constructor(){
    this.TabService = TabService
  }
}
