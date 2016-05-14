import { Component } from '@angular/core';
import {PgService} from "../services/pg.service";

@Component({
  selector: 'nav',
  template: `
    <div class="schema" *ngFor="let schema of schemas"  [class.open]="schema.open">
      <div class="schema-name" (click)="open(schema)">{{schema.name}}</div>
      <div class="table" *ngFor="let table of schema.tables">
        {{table.name}} <sup>{{table.type}}</sup>
      </div>
    </div>
  `,
  styles: [`
    .schema { position: relative;}
    .schema-name, .table {
        padding: 2px 0 2px 20px; 
    }
    .schema:after{
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
                let sname = val[1]
                if (typeof tmp[sname] == 'undefined'){
                    tmp[sname] = {tables: []}
                } else {
                    tmp[sname].tables.push({name: val[2], type: val[3]});
                }
            });

            for(var schema in tmp){
                console.log(schema, tmp)
                let obj = {name: schema, tables: [], open: false}
                if (tmp[schema].tables.length === 0) continue;
                tmp[schema].tables.forEach((val) => {
                    obj.tables.push(val);
                });
                this.schemas.push(obj);
            }
          }
        })
  }
}