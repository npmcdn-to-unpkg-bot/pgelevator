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
    
    listDatabases(){
        let sql="SELECT DISTINCT  catalog_name db_name FROM information_schema.schemata;";
    }
    
    listSchemas(dbName:string){
        let sql="SELECT catalog_name db_name, schema_nameFROM information_schema.schemata WHERE catalog_name = ?1 AND schema_name NOT LIKE 'pg_%';";
    }
    
    listTables(dbName:string, schemaName:string){ // and views
        let sql=`SELECT table_catalog db, table_schema,table_name,  
            table_type, is_insertable_into, is_typed,
            array_agg(CASE WHEN cp.data_column IS NOT NULL THEN cp.data_column END) primary_key,
            array_agg(CASE WHEN cp.data_column IS NOT NULL THEN cp.data_type END) primary_key_type
            FROM information_schema.tables t
            LEFT JOIN (
                SELECT a.attname data_column, format_type(a.atttypid, a.atttypmod) AS data_type, i.indrelid
                FROM   pg_index i
                JOIN   pg_attribute a ON a.attrelid = i.indrelid
                                    AND a.attnum = ANY(i.indkey)
            AND    i.indisprimary
            ) cp ON cp.indrelid = CONCAT(table_schema,'.',table_name)::regclass
            WHERE
            table_catalog= ?1 AND table_schema = ?2
            AND table_type in ('BASE TABLE', 'VIEW')
            GROUP BY table_catalog , table_schema,table_name,  table_type, is_insertable_into, is_typed
            ORDER BY table_schema,table_name;`;
    }
    listSequences(dbName:string, schemaName:string){
        let sql=`SELECT *, sequence_name, data_type, minimum_value, maximum_value, start_value FROM information_schema.sequences 
            WHERE sequence_catalog= ?1 AND sequence_schema= ?2 ;`
    }
    listFunctions(schemaName:string){
        let sql=`SELECT  p.proname FROM    pg_catalog.pg_namespace n
            JOIN pg_catalog.pg_proc p ON p.pronamespace = n.oid WHERE n.nspname = ?1 `;
    }
    listDataTypes(){
        let sql=`SELECT n.nspname as "Schema",
            pg_catalog.format_type(t.oid, NULL) AS "Name",
            pg_catalog.obj_description(t.oid, 'pg_type') as "Description"
            FROM pg_catalog.pg_type t
                LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
            WHERE (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid))
            AND NOT EXISTS(SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid)
            AND pg_catalog.pg_type_is_visible(t.oid)
            ORDER BY 1, 2;`;
    }
    
}