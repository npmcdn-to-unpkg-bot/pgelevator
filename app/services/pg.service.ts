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

let isLocal = !!window.location.href.match(/^https?:\/\/localhost:3000.*$/gi);
let serverUri = '//159.203.127.218:4000'

window.onbeforeunload = (e)=>{
    if ( PgService.connectionId != -1 ) {
        PgService.disconnect()
    }
}

function req(url,d,sync?:boolean) :Observable<any>{
    var xhr = new XMLHttpRequest();
    var subs = [] as any[]
    xhr.withCredentials = true;
    if ( !sync )
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 ) {
            try {
                var data = JSON.parse(xhr.responseText);
            }catch (e){
                subs.forEach((o)=>{
                    o.error(data);
                });
                subs = []
            }
            if ( xhr.status == 200) {
                subs.forEach((o)=>{
                    o.next(data);
                });
            } else {
                subs.forEach((o)=>{
                    o.error(data);
                });
            }
            subs.forEach((o)=>{
                o.complete();
            });
            subs = [];
        }
    };
    xhr.open("POST", url, !sync);
    xhr.setRequestHeader('Accept','application/json');
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    var error = null;
    try {
        xhr.send(JSON.stringify(d));
    }catch(e){
        error = e;
    }
    return Observable.create(function(obs){
        if ( error ) {
            obs.error(error)
            obs.complete();
        }else
            subs.push(obs);
        return function(){
            obs = []
        }
    })
}

export var PgService = {
    
    types: null as {[_:string]:PgType},

    connectionId:-1,

    dbName:null,

    connect(param:{port:number; dbName:string; hostName:string; password:string; user:string}) {
        if ( this.connectionId != -1 )throw 'e!'
        return req(serverUri+'/connect',param).map((d)=>{
            if ( d.connection ) {
                if ( this.connectionId != -1 && this.connectionId != d.connection )throw 'e!'
                PgService.connectionId = d.connection;
            }
            this.dbName = param.dbName;
            return d;
        });
    },
    
    disconnect(){
        req(serverUri+'/disconnect',{connectionId:this.connectionId},true)
    },

    connectSpecial() {
        if ( this.connectionId != -1 )throw 'e!'
        return req(serverUri+'/connect-special',{}).map((d)=>{
            if ( d.connection ) {
                if ( this.connectionId != -1 && this.connectionId != d.connection )throw 'e!'
                PgService.connectionId = d.connection;
            }
            this.dbName = 'pgadmin';
            return d;
        });
    },

    query(query:string, ...values:any[]){
        return req('//159.203.127.218:4000/sql', {userId: this.connectionId, sql: query, values: values})
    },
    
    listDatabases(){
        let sql="SELECT DISTINCT catalog_name db_name FROM information_schema.schemata;";
        return this.query(sql);
    },
    
    listSchemas(dbName:string){
        let sql="SELECT catalog_name db_name, schema_name FROM information_schema.schemata " +
            "WHERE catalog_name = $1 ;";
        return this.query(sql, dbName);
    },
    getSchema(schemaId:number){
        
        let sql=`SELECT n.oid schema_id, n.nspname AS schema_name,                                          
            pg_catalog.pg_get_userbyid(n.nspowner) AS schema_owner,                 
            pg_catalog.obj_description(n.oid, 'pg_namespace') AS schema_comment 
            FROM pg_catalog.pg_namespace n                                       
            WHERE n.oid = $1      
            ORDER BY 1;`;
        return this.query(sql, schemaId);
    },
    
    listTables()   { // and views
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
        return this.query(sql, this.dbName)
    },
    listTablesFromSchema( schemaName:string){ // and views
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
        return this.query(sql, this.dbName, schemaName)
    },
    listSequences(schemaName:string){
        let sql=`SELECT *, sequence_name, data_type, minimum_value, maximum_value, start_value FROM information_schema.sequences 
            WHERE sequence_catalog= $1 AND sequence_schema= $2 ;`
        return this.query(sql, this.dbName, schemaName)
    },
    listFunctions(schemaName:string){
        let sql=`SELECT  p.proname FROM    pg_catalog.pg_namespace n
            JOIN pg_catalog.pg_proc p ON p.pronamespace = n.oid WHERE n.nspname = $1 `;
        return this.query(sql, schemaName)
    },
    listDataTypes(){
        let sql=`SELECT DISTINCT pg_catalog.format_type(t.oid, NULL) d_types
            FROM pg_catalog.pg_type t
                LEFT JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
            WHERE (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid))
            AND NOT EXISTS(SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid)
            AND pg_catalog.pg_type_is_visible(t.oid)
            ORDER BY 1;`;
        return this.query(sql)

    },
    listCols( schemaName:string, tableName:string){
        let sql=`SELECT ordinal_position, column_name, COLUMNS.data_type, COLUMNS.udt_name udt_type, 
            CASE WHEN COLUMNS.data_type='ARRAY' THEN e.data_type||'[]' WHEN (column_default ilike 'nextval(%' AND is_nullable='NO') THEN 'serial' ELSE COLUMNS.data_type END field_type,
            column_default, CASE WHEN is_nullable='YES' THEN true else false end is_nullable, COLUMNS.character_maximum_length,
            COLUMNS.numeric_precision, COLUMNS.numeric_scale decimal_precision, c.constraint_type,
            CASE WHEN c.constraint_type='PRIMARY KEY' THEN 'PK' WHEN c.constraint_type='FOREIGN KEY' THEN 'FK' WHEN c.constraint_type='UNIQUE' THEN 'UN' ELSE null END contraint_display, 
            c.f_table , c.f_col, c.constraint_name,
            c1.description, false editing 
            FROM INFORMATION_SCHEMA.COLUMNS 
            LEFT JOIN (
                SELECT c.table_catalog db, c.table_schema sch,c.table_name tb,c.column_name col,pgd.description
                FROM pg_catalog.pg_statio_all_tables as st
                inner join pg_catalog.pg_description pgd on (pgd.objoid=st.relid)
                inner join information_schema.columns c on (pgd.objsubid=c.ordinal_position
                    and  c.table_schema=st.schemaname and c.table_name=st.relname)
            ) c1 ON c1.db=table_catalog AND c1.sch=table_schema AND c1.tb=table_name AND c1.col=column_name
            LEFT JOIN information_schema.element_types e
                ON ((table_catalog, table_schema, table_name, 'TABLE', COLUMNS.dtd_identifier)
                = (e.object_catalog, e.object_schema, e.object_name, e.object_type, e.collection_type_identifier))
            LEFT JOIN (
                SELECT DISTINCT tc.table_catalog dg, tc.constraint_schema sch, 
                    tc.table_name tb, kcu.column_name col_name, 
                    CASE WHEN tc.constraint_type='FOREIGN KEY' THEN ccu.table_name ELSE null END AS f_table,
                    CASE WHEN tc.constraint_type='FOREIGN KEY' THEN ccu.column_name ELSE null END f_col, 
                    tc.constraint_name, tc.constraint_type
                FROM information_schema.table_constraints AS tc 
                JOIN information_schema.key_column_usage AS kcu
                    ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage AS ccu
                    ON ccu.constraint_name = tc.constraint_name
                    WHERE tc.constraint_type in ('PRIMARY KEY', 'UNIQUE', 'FOREIGN KEY')
            ) as c ON c.dg=table_catalog AND c.sch=table_schema AND c.tb=table_name AND c.col_name=column_name
            WHERE table_catalog= $1 AND table_schema= $2 AND table_name = $3 ;`;
            return this.query(sql, this.dbName, schemaName, tableName);
    },
    listIndexes(schemaName:string, tableName:string){
        let sql=`select indexrelid, i.indexname idxm, i.indexdef definition, pgd.description
            from pg_indexes i
            INNER JOIN pg_statio_all_indexes a ON a.schemaname=i.schemaname AND a.relname=i.tablename AND indexrelname=indexname
            LEFT JOIN pg_catalog.pg_description pgd on (pgd.objoid=a.indexrelid)
            where i.schemaname= $1 AND tablename = $2 ;`;
        return this.query(sql, schemaName, tableName);
    },

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
    },

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
    },
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
    },
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
    },
    dropColumn(schemaName:string, tableName:string, colName:string){
        let sql='ALTER TABLE "'+schemaName+'"."'+tableName+'" DROP COLUMN IF EXISTS "'+colName+'";'
        return this.query(sql);
    },
    editColumn(schemaName:string, tableName:string, oldName:string, newName:string, comment:string){
        let sql=' COMMENT ON COLUMN "'+schemaName+'"."'+tableName+'"."'+oldName+'" IS \''+(comment==null?'':comment)+'\'; ';
        if (oldName!=newName){
            sql+=' ALTER TABLE "'+schemaName+'"."'+tableName+'" RENAME COLUMN "'+oldName+'" TO "'+newName+'";'
        }
        return this.query(sql);
    },
    dropConstraint(schemaName:string, tableName:string, keyName:string){
        let sql='ALTER TABLE "'+schemaName+'"."'+tableName+'" DROP CONSTRAINT "'+keyName+'";';
        return this.query(sql);
    }
}