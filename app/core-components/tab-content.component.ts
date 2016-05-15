import { Component } from '@angular/core';
import {PanelsService} from '../services/panels.service'
import {QueryPanelComponent} from '../panel-components/query-panel.component'
import {TableDataPanelComponent} from "../panel-components/table-data.components";

@Component({
  selector: 'tab-content',
  directives: [QueryPanelComponent,TableDataPanelComponent],
  template: `
    <div *ngFor="let model of PanelsService.models" [style.display]="model.active?'block':'none'">
        <query-panel *ngIf="model.type == 'query'" [model]="model"></query-panel>
        <table-data *ngIf="model.type == 'table-data'" [model]="model"></table-data>
    </div>
  `
})
export class TabContentComponent {
  PanelsService = PanelsService
}
