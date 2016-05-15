import { Component, Input } from '@angular/core'
import {EditorComponent} from "../components/editor.component";
import {GridComponent} from "../components/grid.component";
import {PanelModel} from "../services/panels.service";
import {PgService} from "../services/pg.service";

export class TableDataPanelModel implements PanelModel{
    type = "table-data";
    active;
    title
    code = ""
    result:any

    constructor(schema:string,table:string){
        if ( schema && schema != 'public' )
            this.title = '"'+schema+'"."'+table+'"'
        else
            this.title = '"'+table+'"'
    }
}
@Component({
    template: `<grid [result]="model.result"></grid>` ,
    directives: [EditorComponent,GridComponent],
    selector: 'table-data'
})
export class TableDataPanelComponent{

    @Input() model:TableDataPanelModel

    constructor(private pg:PgService){
    }

    ngOnInit(){
        this.pg.query("SELECT * FROM "+this.model.title)
            .subscribe((res)=>this.model.result = res);
    }
}