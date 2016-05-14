import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'grid',
    template: '',
    styles: [`
        :host-context{position:absolute;left:0;top:0;bottom:0;right:0;  }
        :host-context table {  border-collapse:collapse; }
        :host-context table.content-table { width:100%; margin-top:-21px;}
        :host-context th, :host-context td {
            white-space: nowrap; height: 21px;
            border-width: 1px; border-style: solid }
        :host-context>div {
            position:absolute;left:0;top:21px;bottom:0;right:0;overflow: auto
        }
    `]
})
export class GridComponent{
    el:HTMLElement
    result
    constructor(el:ElementRef){
        this.el = el.nativeElement as HTMLElement;
        var d = []
        for ( var c=0; c< 100000; c++ ) {
            d.push(['asjdhf',654654,"asdklfjhaklsdfhkljashdf",'564',null,false,'asdfasdf',true,new Date]);
        }
        this.result = {
            rows: d,
            cols: [{name:'A'},{name:'B'},{name:'C'},{name:'A'},{name:'A...'},{name:'A...'},{name:'A...'},
                {name:'...asdf'},{name:'Asdf kjahsdf ha.'}]
        };
        this.el.innerHTML = this.html();
        this.el.appendChild( this.cloneHeader() );
        window.addEventListener('resize',this.resize)
    }
    
    resize = ()=>{
        this.fixSize()
    }
    
    ngOnDestroy(){
        window.removeEventListener('resize',this.resize)
    }
    
    ngOnInit(){
        this.fixSize(); 
    }
    
    cloneHeader():HTMLElement{
        var thead = this.el.querySelector('thead').cloneNode(true);
        var table = document.createElement('table');
        table.className = 'grid-header';
        table.appendChild(thead);
        return table;
    }
    
    fixSize(){
        var headerThs = this.el.querySelectorAll('.grid-header th');
        var hiddenThs = this.el.querySelectorAll('.content-table th');
        for ( var c=0; c<hiddenThs.length; c++) {
            (headerThs[c] as HTMLElement).style.width =
                (hiddenThs[c] as HTMLElement).offsetWidth+'px'; 
        }
        (this.el.querySelector('.grid-header') as HTMLElement).style.width = 
               (this.el.querySelector('.content-table') as HTMLElement).offsetWidth+'px'
    }
    
    html(){
        var h = ['<div style=""><table class=content-table><thead><tr>'];
        this.result.cols.forEach((c)=>{
            h.push('<th>')
            h.push( c.name )
            h.push('</th>')
        })
        h.push('</tr></thead><tbody>');
        for ( var c=0; c < 500 && c < this.result.rows.length; c++ ) {
            var row = this.result.rows[c];
            h.push('<tr>')
            row.forEach((cell)=>{
               h.push('<td>')
               h.push( cell )
               h.push('</td>') 
            });
            h.push('</tr>')
        }
        
        h.push('</tbody></table></div>');
        
        return h.join('')
    }
}