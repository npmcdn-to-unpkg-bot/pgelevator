
import { Component, Input } from '@angular/core'
import {PanelModel} from "../services/panels.service";
import {EditorComponent} from "../components/editor.component";
import {GridComponent} from "../components/grid.component";
import {PgService} from "../services/pg.service";

export class QueryPanelModel extends PanelModel{
    type = "query";
    active;
    title = "New Query"
    code = ""
}

@Component({
    template: `
        <editor (code)="setCode($event)"
            style="height:300px;display:block;position:absolute;top:0;left:0;right:0"></editor>
        <button (click)="executar()"
            style="position:absolute;right:5px;top:256px;padding:10px;">Executar</button>
        <grid style="top:300px" [result]="result"></grid>` ,
    directives: [EditorComponent,GridComponent,GridComponent],
    selector: 'query-panel'
})
export class QueryPanelComponent{

    @Input() model
    code:string
    pg = PgService
    private result;
    
    executar(){
        this.pg.query(this.code)
            .subscribe((res)=>{
                console.log(res)
                this.result = res;
            })
    }

    setCode(v){
        this.code = v;
    }
}