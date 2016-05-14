
import { Component, Input } from '@angular/core'
import {PanelModel} from "../services/panels.service";

export class QueryPanelModel implements PanelModel{
    type = "query";
    active;
    title = "Nova Consulta"
}

@Component({
    template: 'query... {{model | json}}',
    selector: 'query-panel'
})
export class QueryPanelComponent{

    @Input() model

}