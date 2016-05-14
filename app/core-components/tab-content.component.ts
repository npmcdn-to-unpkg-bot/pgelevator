import { Component } from '@angular/core';
import {PanelsService} from '../services/panels.service'
import {QueryPanelComponent} from '../panel-components/query-panel.component'

@Component({
  selector: 'tab-content',
  directives: [QueryPanelComponent],
  template: `
    <div *ngFor="let model of PanelsService.models" [style.display]="model.active?'block':'none'">
        <query-panel *ngIf="model.type == 'query'" [model]="model"></query-panel>
    </div>
  `
})
export class TabContentComponent {
  PanelsService = PanelsService
}
