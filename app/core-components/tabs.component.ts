import { Component } from '@angular/core';
import {PanelsService, PanelModel} from "../services/panels.service";
import {QueryPanelComponent, QueryPanelModel} from "../panel-components/query-panel.component";

@Component({
  selector: 'tabs',
  template: `
    <span *ngFor="let tab of PanelsService.models" [class.active]=tab.active style=float:left class=tab
      (click)=activate(tab)>
      <span class="tab-title">
      {{tab.title}}
      </span>
      <span class="close-tab" (click)="close(tab)">
           <i class="fa fa-close"></i>
        </span>
    </span>
    <span class="add" (click)=novaConsulta()><i class="fa fa-plus"></i></span>
  `,
  styles: [`
    :host-context{overflow:hidden;} 
    .add{position:absolute;right:0;font-size:22px;padding:4px;opacity:.5;}
    .add:hover { opacity: 1 }
    
    .close-tab { opacity: .5 }
    .close-tab:hover { opacity: 1 }
    
    .tab { position: relative;}
    .close-tab { position: absolute; right: 6px; top: 2px }
    .tab-title { float: left; padding: 6px; border-left: 1px solid #bbb; padding-right: 20px }
    .tab.active .tab-title{ background: white; color: #000; box-shadow: 0 0px 2px rgba(0,0,0,.7); border-left-color: white; }
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
  close(tab){
    this.PanelsService.close(tab)
  }
}