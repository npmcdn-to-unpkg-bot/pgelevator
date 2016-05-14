import { Component } from '@angular/core';

import {TabService,Tab} from '../services/tab.service'

@Component({
  selector: 'tabs',
  template: `
    <span *ngFor="let tab of tabs" [class.active]=tab.active style=float:left class=tab
      (click)=activate(tab)>
      {{tab.type}}
    </span>
    <button (click)=novaConsulta()>Nova Consulta</button>
  `
})
export class TabsComponent {
  tabs:Tab[] 
  constructor(){
    this.tabs = TabService.tabs
  }
  novaConsulta(){
  }
  activate(tab:Tab) {
    TabService.activate(tab)
  }
}