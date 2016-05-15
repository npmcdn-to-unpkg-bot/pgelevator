import { Component, ElementRef, Input } from '@angular/core';

@Component({
    selector: 'grid',
    template: '',
    styles: [`
        :host-context{position:absolute;left:0;top:0;bottom:0;right:0; overflow:hidden }
        :host-context table.content-table { width:100%; }
        :host-context table.content-table thead { visibility: hidden; }
        :host-context>div {
            position:absolute;left:0; bottom:0;right:0;overflow: auto
        }
    `]
})
export class GridComponent{

    @Input() result
    @Input() fitLayout=0
    
    ROW_HEIGHT = 21
    el:HTMLElement
    headerTable:HTMLElement
    div:HTMLElement
    innerDiv:HTMLElement
    start:number
    end:number
    resize = ()=>{
        this.fit()
    }
    timeout
    lastTop = 0
    scroll = () => {
        if ( this.div && this.div.scrollLeft ) {
            var header = this.el.querySelector('.grid-header') as HTMLElement;
            if ( header)
                header.style.marginLeft = this.div.scrollLeft == 0 ? '0': '-' + this.div.scrollLeft + 'px'
        }
        // if ( this.div.scrollTop == this.lastTop )return
        // this.lastTop = this.div.scrollTop;

        clearTimeout(this.timeout)
        this.timeout = setTimeout(()=>{
            if ( !this.result ) {
                return
            }
            var left = this.div && this.div.scrollLeft;
            this.calculatePart();
            this.innerDiv.innerHTML = this.html()
            this.putInPosition()
            this.fit()
            this.div.scrollLeft = left;
        },250)
    }
    
    constructor(el:ElementRef) {
        this.el = el.nativeElement as HTMLElement;
    }
    ngOnInit(){
        this.buildResult()
    }
    timeout2
    ngOnChanges(changes) {
        if ( changes.result )
            this.buildResult()
        else if ( changes.fitLayout ) {
            clearTimeout(this.timeout2)
            this.timeout2 = setTimeout(()=> {
                this.fit()
            },20);
        }
    }
    ngAfterViewInit(){
        this.fit()
    }

    buildResult(){
        window.removeEventListener('resize',this.resize)
        this.div && this.div.removeEventListener('scroll',this.scroll)
        if ( !this.result ) {
            return
        }
        var left = this.div && this.div.scrollLeft;
        this.el.innerHTML = '<div><div style=overflow:hidden></div></div><table class=grid-header></table>'
        this.headerTable = this.el.querySelector('.grid-header') as HTMLElement
        this.div = this.el.querySelector('div') as HTMLElement
        this.innerDiv = this.el.querySelector('div>div') as HTMLElement;
        this.calculatePart();
        this.innerDiv.innerHTML = this.html();
        this.putInPosition();
        this.cloneHeader();
        window.addEventListener('resize',this.resize);
        this.div.addEventListener('scroll',this.scroll)
        this.innerDiv.style.height = Math.round(this.ROW_HEIGHT*(this.result.rows.length)+1).toLocaleString().replace(/\./g,'') + 'px'
        if ( left )
            this.div.scrollLeft = left;
        this.fit()
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
        this.start = Math.round(start);
        this.end = Math.round(end);
    }
    
    ngOnDestroy(){
        window.removeEventListener('resize',this.resize)
        this.div && this.div.removeEventListener('scroll',this.scroll)
    }
    
    cloneHeader(){
        var thead = this.el.querySelector('thead').cloneNode(true);
        this.headerTable.innerHTML = ''
        this.headerTable.appendChild(thead);
    }
    
    fit(){
        if ( !this.result )return;
        this.innerDiv.style.width = ''
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
        header.style.marginLeft = this.div.scrollLeft ? '-'+this.div.scrollLeft+'px':'0'
        header.style.width = contentTable.offsetWidth+'px'
        this.innerDiv.style.width = contentTable.offsetWidth+'px'
    }
    
    html(){
        var h = ['<table class=content-table><thead><tr>'];
        this.result.fields.forEach((c)=>{
            h.push('<th>')
            h.push( c.name )
            h.push('</th>')
        })
        h.push('</tr></thead><tbody>');
        for ( var c=this.start; c <= this.end && c < this.result.rows.length; c++ ) {
            var row = this.result.rows[c];
            h.push('<tr>')
            var c2=0;
            row.forEach((cell)=>{
                var col = this.result.fields[c2]
                h.push('<td><div class="')
                if ( cell === null )
                    h.push('null ')
                if ( typeof cell == 'boolean' )
                    h.push('boolean')
                else if ( typeof cell == 'string' )
                    h.push('string')
                else if ( typeof cell == 'number' )
                    h.push('number')
                h.push('">');
                if ( cell === null )
                    h.push('null')
                else
                    h.push( cell )
                h.push('</div></td>')
                c2++
            });
            h.push('</tr>')
        }
        h.push('</tbody></table>')
        return h.join('')
    }
}