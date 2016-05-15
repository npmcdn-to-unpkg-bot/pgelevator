import {Http, Response, RequestOptions, Headers} from '@angular/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'

/**Manager imports */
interface Schema {
    id: number;
    name: string;
    oldName: string;
    owner: string;
    database:string;
    comment:string;
}
// interface Database {
//     id: number;
//     name: string;
//     owner:string;
//     comment:string;
//     charset:string;
// }

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
    
    types:{[_:string]:PgType}

    constructor(public http:Http){
        // this.getTypes()
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
        let sql="SELECT DISTINCT catalog_name db_name FROM information_schema.schemata;";
        return this.query(sql);
    }
    
    listSchemas(dbName:string){
        let sql="SELECT catalog_name db_name, schema_name FROM information_schema.schemata " +
            "WHERE catalog_name = $1 ;";
        return this.query(sql, dbName);
    }
    getSchema(schemaId:number){
        
        let sql=`SELECT n.oid schema_id, n.nspname AS schema_name,                                          
            pg_catalog.pg_get_userbyid(n.nspowner) AS schema_owner,                 
            pg_catalog.obj_description(n.oid, 'pg_namespace') AS schema_comment 
            FROM pg_catalog.pg_namespace n                                       
            WHERE n.oid = $1      
            ORDER BY 1;`;
        return this.query(sql, schemaId);
    }
    
    listTables(dbName:string)   { // and views
        let sql=`SELECT s.catalog_name db, s.schema_name, t.table_name, t.table_type, t.is_insertable_into, t.is_typed, 
                t.primary_key,
                t.primary_key_type,
                n.oid schema_id
                FROM information_schema.schemata s 
                INNER JOIN pg_catalog.pg_namespace n ON n.nspname=s.schema_name 
                LEFT JOIN (
                    SELECT table_catalog db, table_schema schema_name,table_name, 
                            table_type, is_insertable_into, is_typed
                            ,            array_agg(CASE WHEN cp.data_column IS NOT NULL THEN cp.data_column END) primary_key,
                            array_agg(CASE WHEN cp.data_column IS NOT NULL THEN cp.data_type END) primary_key_type
                            FROM information_schema.tables t
                            LEFT JOIN (
                                SELECT a.attname data_column, format_type(a.atttypid, a.atttypmod) AS data_type, i.indrelid
                                FROM   pg_index i
                                JOIN   pg_attribute a ON a.attrelid = i.indrelid
                                                    AND a.attnum = ANY(i.indkey)
                            AND    i.indisprimary
                            ) cp ON cp.indrelid = CONCAT(table_schema,'.',table_name)::regclass 
                            WHERE table_catalog= $1 AND (table_type in ('BASE TABLE', 'VIEW') OR table_type is null)
                            GROUP BY table_catalog , table_schema,table_name,  table_type, is_insertable_into, is_typed
                            ORDER BY table_schema, table_type, table_name
                ) AS t ON t.db=s.catalog_name AND t.schema_name=s.schema_name
                WHERE catalog_name = $1 and (n.nspname !~ '^pg_' OR n.nspname='pg_catalog') 
                ORDER BY s.schema_name, t.table_type,t.table_name
                `;
        return this.query(sql, dbName)
    }
    listTablesFromSchema(dbName:string, schemaName:string){ // and views
        let sql=`SELECT table_catalog db, table_schema schema_name,table_name,  
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
            table_catalog= $1 AND table_schema = $2
            AND table_type in ('BASE TABLE', 'VIEW')
            GROUP BY table_catalog , table_schema,table_name,  table_type, is_insertable_into, is_typed
            ORDER BY table_schema,table_type,table_name;`;
        return this.query(sql, dbName, schemaName)
    }
    listSequences(dbName:string, schemaName:string){
        let sql=`SELECT *, sequence_name, data_type, minimum_value, maximum_value, start_value FROM information_schema.sequences 
            WHERE sequence_catalog= $1 AND sequence_schema= $2 ;`
        return this.query(sql, dbName, schemaName)
    }
    listFunctions(schemaName:string){
        let sql=`SELECT  p.proname FROM    pg_catalog.pg_namespace n
            JOIN pg_catalog.pg_proc p ON p.pronamespace = n.oid WHERE n.nspname = $1 `;
        return this.query(sql, schemaName)
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
        return this.query(sql)
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
            ORDER BY a.attnum;`
        return this.query(sql, schemaName, tableName);
    }

    getTypes(){
        let sql = `
            SELECT oid id, typname short_name, 
            pg_catalog.format_type(oid, NULL)  type_name,
            CASE 
            WHEN typcategory = 'A' THEN 'array'
            WHEN typcategory = 'B' THEN 'boolean'
            WHEN typcategory = 'C' THEN 'composite'
            WHEN typcategory = 'D' THEN 'datetime'
            WHEN typcategory = 'E' THEN 'enum'
            WHEN typcategory = 'G' THEN 'geo'
            WHEN typcategory = 'I' THEN 'network'
            WHEN typcategory = 'N' THEN 'numeric'
            WHEN typcategory = 'P' THEN 'pseudo'
            WHEN typcategory = 'R' THEN 'range'
            WHEN typcategory = 'S' THEN 'string'
            WHEN typcategory = 'T' THEN 'timespan'
            WHEN typcategory = 'U' THEN 'userdefined'
            WHEN typcategory = 'V' THEN 'bit'
            WHEN typcategory = 'X' THEN 'unknown'
            ELSE 'unknown' END category
            FROM pg_type 
            WHERE typelem = 0
            AND typtype != 'c'
            ORDER BY typname
        `
        this.query(sql).subscribe((data) => {
            if (data['row']){
                data['row'].forEach((value) => {
                    this.types[value.id] = value;
                });
            }
        });
    }
    listUsers(){
        let sql=`SELECT u.usename AS user_name,
            u.usesysid AS user_id, 
            CASE WHEN u.usesuper AND u.usecreatedb THEN CAST('superuser, create database' AS pg_catalog.text)
                WHEN u.usesuper THEN CAST('superuser' AS pg_catalog.text)
                WHEN u.usecreatedb THEN CAST('create database' AS pg_catalog.text)
                ELSE CAST('' AS pg_catalog.text)
            END AS user_attr
            FROM pg_catalog.pg_user u`;
            return this.query(sql);
    }
    manageSchema(schema:Schema){
        let me=this;
        if (schema.id){ //alter
            let sql="ALTER SCHEMA \""+schema.oldName+"\" RENAME TO \""+schema.name+"\";"
            me.query(sql).subscribe(function(r){
                sql="COMMENT ON SCHEMA \""+schema.name+"\" IS '"+(schema.comment==null?'':schema.comment)+"' ;";
                me.query(sql).subscribe(); 
            });
        }else{ //create
            let sql="CREATE SCHEMA \""+schema.name+"\" AUTHORIZATION "+schema.owner+" ;"
            me.query(sql).subscribe(function(r){
                if(schema.comment!=null) {
                     sql="COMMENT ON SCHEMA \""+schema.name+"\" IS '"+schema.comment+"' ;";
                     me.query(sql).subscribe(); 
                }    
            });
        }
    }
}