import { Component, Input } from '@angular/core'
import {EditorComponent} from "../components/editor.component";
import {GridComponent} from "../components/grid.component";
import {PanelModel} from "../services/panels.service";

export class TableDataPanelModel implements PanelModel{
    type = "table-data";
    active;
    title
    code = ""

    constructor(schema:string,table:string){
        if ( schema && schema != 'public' )
            this.title = '"'+schema+'"."'+table+'"'
        else
            this.title = '"'+table+'"'
    }
}
@Component({
    template: `<grid></grid>` ,
    directives: [EditorComponent,GridComponent],
    selector: 'table-data'
})
export class TableDataPanelComponent{

    @Input() model

}