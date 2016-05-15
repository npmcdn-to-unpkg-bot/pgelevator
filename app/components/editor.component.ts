import { Component, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'editor',
    template: ''
})
export class EditorComponent {
    
    @Output() code:EventEmitter = new EventEmitter()
    codeMirror: CodeMirror;
    constructor(private el:ElementRef){ }

    ngAfterViewInit(){
        this.codeMirror = CodeMirror( this.el.nativeElement, {
            value: "",
            lineNumbers: true,
            mode:  "text/x-sql"
        } );
        this.codeMirror.on('change',(v)=>{
            this.code.emit(v.getValue())
        })
        this.code.emit('')
    }
}