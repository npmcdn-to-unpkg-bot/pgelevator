import { Component, ElementRef } from '@angular/core';

@Component({
    selector: 'grid',
    template: '',
    styles: [`
        :host-context{position:absolute;left:0;top:0;bottom:0;right:0;  }
        :host-context table {  border-collapse:collapse; }
        :host-context table.content-table { width:100%; }
        :host-context table.content-table thead { visibility: hidden; }
        :host-context th, :host-context td {
            white-space: nowrap; height: 21px; 
            border-width: 1px; border-style: solid }
        :host-context>div {
            position:absolute;left:0; bottom:0;right:0;overflow: auto
        }
    `]
})
export class GridComponent{
    
    ROW_HEIGHT = 21
    el:HTMLElement
    result
    headerTable:HTMLElement
    div:HTMLElement
    innerDiv:HTMLElement
    start:number
    end:number
    resize = ()=>{
        this.fixSize()
    }
    timeout
    scroll = () => {
        clearTimeout(this.timeout)
        this.timeout = setTimeout(()=>{
            this.calculatePart();
            this.innerDiv.innerHTML = this.html()
            this.putInPosition()
            this.fixSize()
        },500)
    }
    
    constructor(el:ElementRef){
        this.el = el.nativeElement as HTMLElement;
        this.el.innerHTML = '<div><div></div></div><table class=grid-header></table>'
        this.headerTable = this.el.querySelector('.grid-header') as HTMLElement
        this.div = this.el.querySelector('div') as HTMLElement
        this.innerDiv = this.el.querySelector('div>div') as HTMLElement;
        this.result = this.createFakeResult();
        this.calculatePart();
        this.innerDiv.innerHTML = this.html();
        this.putInPosition();
        this.cloneHeader();
        window.addEventListener('resize',this.resize);
        this.div.addEventListener('scroll',this.scroll)
        this.innerDiv.style.height = Math.round(this.ROW_HEIGHT*(this.result.rows.length+1)).toLocaleString().replace(/\./g,'') + 'px'
    }
    
    putInPosition(){
        var contentTable = this.el.querySelector('.content-table') as HTMLElement;
        contentTable.style.marginTop = Math.round((this.start-1)*this.ROW_HEIGHT).toLocaleString().replace(/\./g,'')+'px';
    }
    
    calculatePart(){
        var sliceSize = 4 * (window.screen.height / this.ROW_HEIGHT)
        var firstRow = this.div.scrollTop/this.ROW_HEIGHT
        var rowsPerBody = document.body.offsetHeight/this.ROW_HEIGHT
        var middle = firstRow + rowsPerBody/2
        var start = Math.round(middle - sliceSize/2)
        if ( start < 0 )
            start = 0;
        var end = start + sliceSize;
        if ( end >= this.result.rows.length)
            end = this.result.rows.length-1;
        start = end - sliceSize;
        if ( start < 0 )
            start = 0;
        this.start = start;
        this.end = end;
    }
    
    createFakeResult(){
        var d = []
        for ( var c=0; c< 100000; c++ ) {
            d.push(['asjdhf',654654,"asdklfjhaklsdfhkljashdf",'564',null,false,'asdfasdf',true,new Date]);
        }
        return {
            rows: d,
            cols: [{name:'A'},{name:'B'},{name:'C'},{name:'A'},{name:'A...'},{name:'A...'},{name:'A...'},
                {name:'...asdf'},{name:'Asdf kjahsdf ha.'}]
        };
    }
    
    ngOnDestroy(){
        window.removeEventListener('resize',this.resize)
        this.div.removeEventListener('scroll',this.scroll)
    }
    
    ngOnInit(){
        this.fixSize(); 
    }
    
    cloneHeader(){
        var thead = this.el.querySelector('thead').cloneNode(true);
        this.headerTable.innerHTML = ''
        this.headerTable.appendChild(thead);
    }
    
    fixSize(){
        var header = this.el.querySelector('.grid-header') as HTMLElement;
        var contentTable = this.el.querySelector('.content-table') as HTMLElement;
        var hiddenHeader = this.el.querySelector('.content-table thead') as HTMLElement;
        var headerThs = this.el.querySelectorAll('.grid-header th');
        var hiddenThs = this.el.querySelectorAll('.content-table th');
        this.div.style.top = hiddenHeader.offsetHeight+'px'
        for ( var c=0; c<hiddenThs.length; c++) {
            (headerThs[c] as HTMLElement).style.width =
                (hiddenThs[c] as HTMLElement).offsetWidth+'px'; 
        }
        header.style.width = contentTable.offsetWidth+'px'
    }
    
    html(){
        var h = ['<table class=content-table><thead><tr>'];
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
        h.push('</tbody></table>')
        return h.join('')
    }
}