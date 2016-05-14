import {Http} from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';

class PgField{
    
}

class PgResult{
    rows:any[][]
    fields:PgField[]
}

class PgQuery extends Observable<PgResult>{
    cancel(){
        
    }
}
@Injectable()
export class PgService{
    
    http:Http
    
    constructor(http:Http){
        this.http = http;
    }
    
    query(query:string){
        return this.http.post('...', JSON.stringify({query: ''}), {
            
        } )
    }
    
    listSchemas(){
        
    }
    
    listTables(schemaName:string){ // and views
        
    }
    
}