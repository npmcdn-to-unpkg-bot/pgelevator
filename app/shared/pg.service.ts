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
interface PgType{
    id:number
    name:string
}

@Injectable()
export class PgService{
    
    http:Http
    types:{[_:string]:PgType}
    
    constructor(private http:Http){
        this.http = http;
        this.getTypes()
    }
    
    query(query:string, ...values:any[]){
        let options = new RequestOptions({ headers: new Headers({'Content-Type': 'application/json'}) });

        return this.http
            .post('http://localhost:4000/sql',
                JSON.stringify({sql: query, values: values}),
                options
            )
            .map((res: Response) => {
                return res.json() || {};
            })
    }
    
    listDatabases(){
        let sql="SELECT DISTINCT  catalog_name db_name FROM information_schema.schemata;";
    }
    
    listSchemas(dbName:string){
        let sql="SELECT catalog_name db_name, schema_nameFROM information_schema.schemata WHERE catalog_name = $1 AND schema_name NOT LIKE 'pg_%';";
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

    listTableMetadata(schemaName:string, tableName:string){
        let sql =`
            SELECT DISTINCT
                a.attnum as num,
                a.attname as name,
                format_type(a.atttypid, a.atttypmod) as typ,
                a.attnotnull as notnull, 
                com.description as comment,
                coalesce(i.indisprimary,false) as primary_key,
                def.adsrc as default
            FROM pg_attribute a 
            JOIN pg_class pgc ON pgc.oid = a.attrelid
            LEFT JOIN pg_index i ON 
                (pgc.oid = i.indrelid AND i.indkey[0] = a.attnum)
            LEFT JOIN pg_description com on 
                (pgc.oid = com.objoid AND a.attnum = com.objsubid)
            LEFT JOIN pg_attrdef def ON 
                (a.attrelid = def.adrelid AND a.attnum = def.adnum)
            LEFT JOIN pg_namespace nsp ON nsp.oid=pgc.relnamespace
            WHERE a.attnum > 0 AND pgc.oid = a.attrelid
            AND pg_table_is_visible(pgc.oid)
            AND NOT a.attisdropped
            AND nsp.nspname = $1 AND pgc.relname = $2 
            ORDER BY a.attnum;
        `;

    }

    getTypes(){
        let sql = `
            SELECT oid as id, * FROM pg_type 
            WHERE typelem = 0
            AND typtype != 'c'
            ORDER BY typname
        `
        this.query(sql).subscribe((data:PgType[]) => {
            data.forEach((value) => {
                this.types[value.id] = value;
            });
        });
    }
    
}