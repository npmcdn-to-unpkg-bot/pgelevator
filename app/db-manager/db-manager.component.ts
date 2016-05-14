import { Component, OnInit, Input } from '@angular/core';
import { Database } from '../shared/database';

@Component({
  selector: 'db-manager',
  templateUrl: 'app/db-manager/db-manager.component.html',
  styleUrls: ['app/db-manager/db-manager.component.css']
})
export class DbManagerComponent implements OnInit {
    db:Database;
    @Input() id:number;
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
 
    
/*    CREATE DATABASE teste
        WITH ENCODING='UTF8'
       OWNER=postgres
       CONNECTION LIMIT=-1;*/

    
}