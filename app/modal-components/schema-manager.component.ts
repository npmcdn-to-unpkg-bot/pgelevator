import { Component, OnInit, Input } from '@angular/core';
import { PgService } from '../services/pg.service';
import {ModalsService} from '../services/modals.service';

@Component({
  selector: 'schema-manager',
  template: `
<h3 class='modal-close'><i class='fa fa-close' (click)='close()'></i></h3>
<div>
    <label *ngIf="schema.id">Id: {{schema.id}}</label>
    <label class="sch-name">
        Schema name <input type=text [(ngModel)]="schema.name" placeholder="name"/>
    </label>
    
    <label class="sch-owner">
        Owner <select [(ngModel)]="schema.owner">
                <option *ngFor="let u of users" value="{{u}}">{{u}}</option>
            </select>
    </label>
    <label>Comment</label>
    <textarea [(ngModel)]="schema.comment" placeholder="comment"></textarea>
    <input type=button (click)="save()" value="save"/>
</div>`,
  styles: ['div{z-index:5;} label{display:block;}']
})
export class SchemaManagerComponent implements OnInit {
    schema={id:null,
            name:null,
            oldName:null,
            owner:"postgres",
            comment:null,
            database:""
            };
    @Input() model;
    users:string[]=[];
    pgService = PgService
    ngOnInit() {
        /**TODO
         * get current db properties to edit
         */
        this.pgService.listUsers().subscribe((users)=>{
            users.rows.forEach((u)=>{
                this.users.push(u[0]);
            });
        })
        if (this.model.schemaId!=0){
            this.pgService.getSchema(this.model.schemaId).subscribe((schema)=>{
                let s=schema.rows[0];
                this.schema={
                    id:s[0],
                    name:s[1],
                    oldName:s[1],
                    owner:s[2],
                    comment:s[3],
                    database:this.schema.database
                }
            })
        }
    }

    save(){
        let me=this;
        let valid=true;
          me.pgService.listSchemas(me.schema.database).subscribe(function(schemas){
                 schemas.rows.forEach(function(r){
                     if((me.schema.id==null || (me.schema.id!=null && me.schema.name!=me.schema.oldName)) && me.schema.name==r[1]){
                         alert("Sorry, this schema name is already being used!");
                         valid=false;
                     }
                 })
             if(valid){
                me.pgService.manageSchema(me.schema);
                ModalsService.schemaManager = null;
             }
         });
    }
    close(){ModalsService.schemaManager=null;}
}