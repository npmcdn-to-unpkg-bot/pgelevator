import { Component } from '@angular/core';
import {PgService} from "../services/pg.service";
import {ModalsService} from '../services/modals.service';
import {TableDataPanelModel} from "../panel-components/table-data.components";
import {PanelsService} from "../services/panels.service";
import {TableInfoPanelModel} from "../panel-components/table-info.components";

@Component({
  selector: 'nav',
  template: `
   <span (click)='newSchemaModal(0)' class="new-schema" title="New schema"><i class="fa fa-plus"></i></span>
    <div style="position:absolute;top:0;bottom:0;left:0;right:8px;overflow:auto">
    <div class="schema" *ngFor="let schema of schemas"  [class.open]="schema.open" [class.arrow]="schema.tables.length!==0">
      <div class="schema-name" (click)="open(schema)" >{{schema.name}} <span class='edit-schema' (click)='newSchemaModal(schema.id);$event.stopPropagation()'><i class='fa fa-edit'></i></span></div>
      <div style="overflow:hidden" class="tables" [style.height.px]="!schema.open ? 0 : schema.tables.length * 19">
          <div class="table" *ngFor="let table of schema.tables">
            <div class="table-name" (click)="openTable(schema,table)">
                <i class="table-type fa" [class.fa-table]="table.type=='BASE TABLE'" [class.fa-eye]="table.type=='VIEW'"></i>
                {{table.name}} <sup>{{table.type}}</sup></div>
            <span class="table-info" *ngIf="table.type=='BASE TABLE'" (click)="openTableInfo(schema,table)">
                <i class='fa fa-info-circle'></i>
            </span>
          </div>
      </div>
    </div>
    </div>
  `,
  styles: [`
    .schema { position: relative;}
    .schema-name, .table-name {
        padding: 2px 20px 2px 20px; 
    }
    .new-schema { position: absolute; bottom: 0; right: 2px; font-size: 22px; padding: 4px; opacity: .5; z-index: 2 }
    .arrow:after{
        content: ''; border-top: 6px solid transparent; border-bottom: 6px solid transparent;
        border-left: 6px solid #444;
        height: 0; display: block; position: absolute;
        left: 9px; top: 5px; transition: transform .25s;
    }
    .arrow.open:after { transform: rotate(90deg); }
    .tables { transition: height .25s }
    .schema .table { display: none;}
    .schema.open .table {
        display: block;
    }
    .schema sup { font-size: 8px }
    .table, .schema-name { position: relative; }
    .table-name, .schema-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis;  }
    .table-type{display:inline-block;font-size:11px;margin-right:5px;}
    
    .edit-schema, .table-info{font-size:12px; right: 5px; position:absolute; top: 3px;
        color: #888; display: none }
    .edit-schema:hover, .table-info:hover { color: #000 }
    .schema-name, .table-name {padding-right: 0 }
    .schema-name:hover, .table:hover .table-name { padding-right: 20px }
    .schema-name:hover .edit-schema, .table:hover .table-info { display: block }
    
  `]
})
export class NavComponent {
  
  schemas = []

    open(schema){
        let active = this.schemas.filter((s) => s.open)[0]
        if (schema === active) {
            schema.open = false
        } else {
            if (active) active.open = false
            this.schemas[this.schemas.indexOf(schema)].open = true
        }
    }

    openTable(schema,table) {
        PanelsService.add( new TableDataPanelModel(schema.name,table.name));
    }

    openTableInfo(schema,table) {
        PanelsService.add( new TableInfoPanelModel(schema.name,table.name));
    }
    _pg = PgService
  constructor(){

    this._pg.listTables()
        .subscribe((res) => {
          var tmp = {}, result = [];
          if (res.rows) {
            res.rows.forEach((val) => {
                let sname = val[1];
                if (typeof tmp[sname] == 'undefined'){
                    tmp[sname] = {tables: [], id:val[8]}
                    if (val[2]!=null) tmp[sname].tables.push({name: val[2], type: val[3]});
                } else {
                    tmp[sname].tables.push({name: val[2], type: val[3]});
                    tmp[sname].id=val[8];
                }
            });
            for(var schema in tmp){
                let obj = {name: schema, tables: [], open: false, id:tmp[schema].id}
                if (tmp[schema].tables.length === 0) {
                    this.schemas.push(obj);    
                }else{
                    tmp[schema].tables.forEach((val) => {
                        obj.tables.push(val);
                    });
                    this.schemas.push(obj);    
                }
                
            }
          }
        })
  }
  newSchemaModal(schemaId:number){
      ModalsService.schemaManager = {schemaId:schemaId}
  }
}