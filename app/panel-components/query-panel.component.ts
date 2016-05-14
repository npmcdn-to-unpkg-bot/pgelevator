
import { Component, Input } from '@angular/core'
import {PanelModel} from "../services/panels.service";
import {EditorComponent} from "../components/editor.component";
import {GridComponent} from "../components/grid.component";

export class QueryPanelModel implements PanelModel{
    type = "query";
    active;
    title = "New Query"
    code = ""
}

@Component({
    template: `
        <editor code="model.code" style="height:300px;display:block;position:absolute;top:0;left:0;right:0"></editor>
        <grid style="top:300px"></grid>` ,
    directives: [EditorComponent,GridComponent],
    selector: 'query-panel'
})
export class QueryPanelComponent{

    @Input() model

}