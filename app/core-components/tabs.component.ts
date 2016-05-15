import { Component } from '@angular/core';
import {PanelsService, PanelModel} from "../services/panels.service";
import {QueryPanelComponent, QueryPanelModel} from "../panel-components/query-panel.component";

@Component({
  selector: 'tabs',
  template: `
    <span *ngFor="let tab of PanelsService.models" [class.active]=tab.active style=float:left class=tab
      (click)=activate(tab)>
      {{tab.title}}
    </span>
    <span class="add" (click)=novaConsulta()><i class="fa fa-plus"></i></span>
  `,
  styles: [`
    :host-context{overflow:hidden;} 
    .add{position:absolute;right:0;font-size:22px;padding:4px;opacity:.5;cursor:pointer}
    .add:hover { opacity: 1 }
  `]
})
export class TabsComponent {
  PanelsService = PanelsService;
  novaConsulta(){
    this.PanelsService.add(new QueryPanelModel())
  }
  activate(tab:PanelModel) {
    this.PanelsService.activate(tab)
  }
}