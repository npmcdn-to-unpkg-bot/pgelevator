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
    <button (click)=novaConsulta()>Nova Consulta</button>
  `,
  styles: [':host-context{overflow:hidden;}']
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