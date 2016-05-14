import { Component, OnInit, Input } from '@angular/core';
import { PgService } from '../services/pg.service';

@Component({
  selector: 'db-manager',
  templateUrl: 'app/db-manager/db-manager.component.html',
  styleUrls: ['app/db-manager/db-manager.component.css']
})
export class DbManagerComponent implements OnInit {
    db;
    @Input() id:number;
    constructor(
        private pgService:PgService
    ){}
    ngOnInit() {
        /**TODO
         * get pg-roles to select owner
         * get current db properties to edit
         */
        
        if (!this.id){
            this.db={
                id:null,
                name:null,
                owner:"postgre",
                comment:null,
                charset:"UTF-8"
            }
        }else{
            /**TODO
             * load db properties
             */
        }
    }
    
    
    save(){
         this.pgService.listDatabases().subscribe(function(dbs){
             
             console.log(dbs);
             //this.pgService.manageDb(this.db);
         });
        
    }
 
    

    
}