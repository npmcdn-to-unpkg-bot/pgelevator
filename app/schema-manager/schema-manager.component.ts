import { Component, OnInit, Input } from '@angular/core';
import { PgService } from '../services/pg.service';

@Component({
  selector: 'schema-manager',
  templateUrl: 'app/schema-manager/schema-manager.component.html',
  styleUrls: ['app/schema-manager/schema-manager.component.css']
})
export class SchemaManagerComponent implements OnInit {
    schema;
    @Input() id:number;
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
        if (!this.id){
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