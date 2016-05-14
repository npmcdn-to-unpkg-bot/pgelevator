import { Component, ElementRef, Input } from '@angular/core';


@Component({
    selector: 'editor',
    template: ''
})
export class EditorComponent {
    
    @Input() code
    codeMirror: CodeMirror;
    constructor(private el:ElementRef){ }

    ngAfterViewInit(){
        this.codeMirror = CodeMirror( this.el.nativeElement, {
            value: "SELECT * \nFROM funcionario\nWHERE chave = \"9798765T4\"",
            lineNumbers: true,
            mode:  "text/x-sql"
        } );
    }
    ngOnChanges(changes){
    }
}