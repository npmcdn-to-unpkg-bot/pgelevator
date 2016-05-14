import { Component, OnInit, Input } from '@angular/core';
import { PgService } from '../services/pg.service';

@Component({
  selector: 'schema-manager',
  template: `<div>
    <label>Id: {{schema.id}}</label>
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
    schema;
    @Input() model;
    users:string[]=[];
    constructor(
        private pgService:PgService
    ){}
    ngOnInit() {
        /**TODO
         * get current db properties to edit
         */
        this.pgService.listUsers().subscribe((users)=>{
            users.rows.forEach((u)=>{
                this.users.push(u[0]);
            });
            console.log(this.users);
        })
        if (true){
            this.schema={
                id:null,
                name:"teste",
                owner:"postgres",
                comment:"",
                database:"postal"
            }
        }else{
            /**TODO
             * load db properties
             */
        }
    }
    
    
    save(){
        let me=this;
          me.pgService.listSchemas(me.schema.database).subscribe(function(schemas){
             if(schemas.rows.length>0){
                 schemas.rows.forEach(function(r){
                     if(me.schema.name==r.name){
                         alert("Sorry, this schema name is already being used!");
                         return;
                     }
                 })
             }
             me.pgService.manageSchema(me.schema);
         });
        
    }
 
    

    
}