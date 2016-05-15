import { Component } from '@angular/core';
import {PgService} from "../services/pg.service";
import {ModalsService} from '../services/modals.service';

@Component({
  selector: 'nav',
  template: `
   <input type=button value='new schema' (click)='newSchemaModal(0)'/>
    <div class="schema" *ngFor="let schema of schemas"  [class.open]="schema.open" [class.arrow]="schema.tables.length!==0">
      <div class="schema-name" (click)="open(schema)" >{{schema.name}} <span class='edit-schema' (click)='newSchemaModal(schema.id);$event.stopPropagation()'><i class='fa fa-edit'></i></span></div>
      <div class="table" *ngFor="let table of schema.tables">
        <i class="table-type fa" [class.fa-table]="table.type=='BASE TABLE'" [class.fa-eye]="table.type=='VIEW'"></i>
        {{table.name}}<sup>{{table.type}}</sup>
        <i class='table-info fa fa-info-circle' *ngIf="table.type=='BASE TABLE'"></i> 
      </div>
    </div>
  `,
  styles: [`
    .schema { position: relative;}
    .schema-name, .table {
        padding: 2px 0 2px 20px; 
    }
    .arrow:after{
        content: ''; border-top: 6px solid transparent; border-bottom: 6px solid transparent;
        border-left: 6px solid #444;
        height: 0; display: block; position: absolute;
        left: 9px; top: 5px;
    }
    .schema .table { display: none;}
    .schema.open .table {
        display: block;
    }
    .schema sup { font-size: 8px }
    .table, .schema-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .table-type{display:inline-block;font-size:11px;margin-right:5px;}
    .edit-schema, .table-info{font-size:12px; display:inline-block;margin-left:5px;}
  `]
})
export class NavComponent {
  dbName:string = 'pgadmin';
  
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
  
  constructor(private _pg: PgService){

    _pg.listTables(this.dbName)
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