import { Component, Input } from '@angular/core'
import {EditorComponent} from "../components/editor.component";
import {GridComponent} from "../components/grid.component";
import {PanelModel} from "../services/panels.service";
import {PgService} from "../services/pg.service";

export class TableDataPanelModel extends PanelModel{
    type = "table-data";
    active;
    title
    code = ""
    result:any
    
    constructor(schema:string,table:string){
        super()
        if ( schema && schema != 'public' )
            this.title = '"'+schema+'"."'+table+'"'
        else
            this.title = '"'+table+'"'
    }
}
@Component({
    template: `
        <select style="position:absolute;bottom:3px;right:3px;z-index:1"
            *ngIf="model && model.result && model.result.rows && model.result.rows >= 1000 "
            (change)="setLimit(sel.value)" #sel>
            <option value="1000">1000 entries</option>
            <option value="10000">10.000 entries</option>
            <option value="">All entries</option>
        </select>
        <grid [result]="model.result" [fitLayout]="model.activateDeactivate"></grid>
    ` ,
    directives: [EditorComponent,GridComponent],
    selector: 'table-data'
})
export class TableDataPanelComponent{

    @Input() model:TableDataPanelModel
    fit = 0
    limit = 1000

    pg = PgService

    ngOnInit(){
        this.refresh();
    }

    setLimit(v){
        var limit = !v?null:parseInt(v);
        if ( this.limit != limit ) {
            this.limit = limit;
            this.refresh()
        }
    }

    private refresh() {
        this.pg.query("SELECT * FROM "+this.model.title+ (this.limit?" LIMIT "+this.limit:""))
            .subscribe((res)=>this.model.result = res);
    }
}