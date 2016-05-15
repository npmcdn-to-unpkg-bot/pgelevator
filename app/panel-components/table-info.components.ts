import { Component, Input } from '@angular/core'
import {PanelModel} from "../services/panels.service";

export class TableInfoPanelModel implements PanelModel{
    type = "table-info";
    active;
    title
    code = ""

    constructor(public schema:string,public tableName:string){
        if ( schema && schema != 'public' )
            this.title = '"'+schema+'"."'+tableName+'"'
        else
            this.title = '"'+tableName+'"'
    }
}
@Component({
    template: `
        <h1>"{{model.schema}}"."{{model.tableName}}"</h1>
        ...
` ,
    directives: [],
    selector: 'table-info'
})
export class TableInfoPanelComponent{

    @Input() model

}