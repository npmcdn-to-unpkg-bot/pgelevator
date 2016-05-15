import { Component, Input, OnInit } from '@angular/core'
import {PanelModel} from "../services/panels.service";
import {PgService} from  "../services/pg.service";

export class TableInfoPanelModel extends PanelModel{
    type = "table-info";
    active;
    title;
    code = "";

    constructor(public schemaName:string,public tableName:string){
        super()
        if ( schemaName && schemaName != 'public' )
            this.title = '"'+schemaName+'"."'+tableName+'"'
        else
            this.title = '"'+tableName+'"'
    }
}
@Component({
    template: `
        <h1>"{{model.schemaName}}"."{{model.tableName}}"</h1>
        <h2>Fields</h2>
        <table class="field-table">
            <thead>
                <tr>
<<<<<<< HEAD
                    <th class="act-col">::</th>
                    <th class="key-col">key</th>
                    <th class="field-col">Field</th>
                    <th class="type-col">Type</th>
                    <th class="null-col">Nullable</th>
                    <th class="len-col">Length</th>
                    <th class="prec-col">Precision</th>
=======
                    <td class="act-col">::</td>
                    <td class="key-col">key</td>
                    <td class="field-col">Field</td>
                    <td class="type-col">Type</td>
                    <td class="null-col">Nullable</td>
                    <td class="desc-col">Description</td>
>>>>>>> d13404f2dfcbae6af896ed544fb687425ab8d104
                </tr>
            </thead>
            <tbody *ngFor="let c of cols.current">
                <tr class="prop-row">
                    <td class="action-icons">
                        <i class="fa fa-edit" (click)="editField(c)"  *ngIf="!c[16]"></i>
                        <i class="fa fa-save" (click)="saveField(c)"  *ngIf="c[16]"></i>
                        <i class="fa fa-trash" (click)="deleteField(c)" *ngIf="!c[16]"></i>
                        <i class="fa fa-ban" (click)="cancelEdit(c)" *ngIf="c[16]"></i>
                    </td>
                    <td>{{c[11]}} <sup *ngIf="c[16] && c[11]!=null"><i class="fa fa-close" (click)="removeKey(c)"></i></sup></td>
                    <td>
                        <input [class.editable]="c[16]" type=text [(ngModel)]="c[1]" [readonly]="!c[16]"/>
                    </td>
                    <td>{{c[4]}}</td>
                    <td><input type=checkbox [(ngModel)]="c[6]"/></td>
                    <td><input [class.editable]="c[16]" type=text [(ngModel)]="c[15]" [readonly]="!c[16]"/></td>
                </tr>
            </tbody>
            <tbody *ngIf="newone">
                <tr>
                    <td>
                        <i class="fa fa-save" (click)="saveNewField()"></i>
                        <i class="fa fa-ban" (click)="cancelNewField()"></i>
                    </td>
                    <td></td>
                    <td>
                        <input type=text [(ngModel)]="theNewField.name">
                    </td>
                    <td>
                        <select [(ngModel)]="theNewField.dataType">
                            <option *ngFor="let dt of dTypes" value="{{dt[0]}}">{{dt[0]}}</option>
                        </select>
                    </td>
                    <td><input type=checkbox [(ngModel)]="theNewField.nullable"/></td>
                    <td><input type=text [(ngModel)]="theNewField.comment"></td>
                </tr>
            </tbody>
        </table>
        <span (click)="newField()"><i class="fa fa-plus"></i> add</span>
        
        <h2>Indexes</h2>
        <table>
            <thead>
                <tr>
                    <th>Index</th>
                    <th>Definition</th>
                    <th>Comment</th>
                </tr>
            </thead>
            <tbody>
                <tr *ngFor="let i of idx">
                    <td>{{i[1]}}</td>
                    <td>{{i[2]}}</td>
                    <td>{{i[3]}}</td>
                </tr>
            </tbody>
        
        </table>
        
        
` ,
    styles: [`
        .field-table input{width:100%; background:none; border:none; border-bottom:1px solid transparent;}
        .field-table input.editable{border-bottom:1px solid blue;}
        .field-table .action-icons{text-align:center;}
    `],
    directives: [],
    selector: 'table-info'
})
export class TableInfoPanelComponent implements OnInit{

    @Input() model:TableInfoPanelModel;
    cols={
        original:[],
        current:[]
    };
    idx;
    newone:boolean=false;
    theNewField={
        name:null,
        dataType:null,
        nullable:true,
        comment:null
    };
    dTypes;
    pg =PgService
    
    ngOnInit(){
        this.loadCols();
        this.pg.listIndexes(this.model.schemaName, this.model.tableName).subscribe((res) => {
            this.idx = res.rows;
        })
        this.pg.listDataTypes().subscribe((r)=>{
            console.log(r);
            this.dTypes=r.rows;
        })
    }
    
    private loadCols(){
        this.pg.listCols(this.model.schemaName, this.model.tableName).subscribe((res) => {
            this.cols.original = clone(res.rows,true);
            this.cols.current=res.rows;
        })
    }
    newField(){
        this.newone=true;
    }
    cancelNewField(){
        this.newone=false;
        this.theNewField={
            name:null,
            dataType:null,
            nullable:true,
            comment:null
        };
    }
    saveNewField(){
        if(this.theNewField.name==null || this.theNewField.name.trim()==""){
            alert("Please inform the name of the new column!");
            return;
        }
        if(this.theNewField.dataType==null){
            alert("Please select the type of the new column!");
            return;
        }
        this.pg.addField(this.model.schemaName, this.model.tableName, this.theNewField).subscribe((res){
            this.loadCols();
        });
    }
    editField(field){
        console.log(this.cols);
        field[16]=true;
    }
    deleteField(field){
        if (confirm("This action can't be undone. Confirm dropping column "+field[1]+"?")){
            this.pg.dropColumn(this.model.schemaName, this.model.tableName, field[1]).subscribe((res)=>{
                this.loadCols();
            });
        }
    }
    cancelEdit(field){
        let fo=[];
        this.cols.original.forEach((f)=>{
            if(f[0]===field[0]){fo=f;}
        });
        field[11]=fo[11];
        field[1]=fo[1];
        field[4]=fo[4];
        field[6]=fo[6];
        field[7]=fo[7];
        field[9]=fo[9];
        field[15]=fo[15];
        field[16]=false;
    }
    saveField(field){
        let fo=[];
        console.log(this.cols);
        if (confirm("Confirm the changes on column "+field[1]+"?")){
            this.cols.original.forEach((f)=>{
                if(f[0]===field[0]){fo=f;}
            });
            this.pg.editColumn(this.model.schemaName, this.model.tableName, fo[1], field[1], field[15]).subscribe((res)=>{
                 this.loadCols();
            });
        }
    }
    removeKey(field){
        if (confirm("This action can't be undone. Confirm dropping the constraint "+field[14]+"?")){
            this.pg.dropConstraint(this.model.schemaName, this.model.tableName, field[14]).subscribe((res)=>{
                this.loadCols();
            });
        }
    }
}

function clone (obj,deep) {
    if ( !obj )
        return obj;
    if ( typeof obj != 'object' && obj )
        return obj.valueOf();
    var res = obj instanceof Array ? [] : {};
    if ( deep ) {
        for ( var i in obj ) {
            if ( typeof obj[i] == 'object' && obj[i] )
                res[i] = clone(obj[i],deep);
            else
                res[i] = obj[i];
        }
    }else {
        for ( var i in obj ) {
            res[i] = obj[i];
        }
    }
    return res;
};