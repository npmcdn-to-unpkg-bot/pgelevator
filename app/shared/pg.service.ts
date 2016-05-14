import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'

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
    
    constructor(private http:Http){
        this.http = http;
    }
    
    query(query:string){
        let options = new RequestOptions({ headers: new Headers({'Content-Type': 'application/json'}) });

        return this.http
            .post('http://localhost:4000/sql',
                JSON.stringify({sql: query}),
                options
            )
            .map((res: Response) => {
                let body = res.json();
                return body || {};
            })
    }
    
    listSchemas(){
        
    }
    
    listTables(schemaName:string){ // and views
        
    }
    
}