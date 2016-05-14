import { Component, ElementRef, Input } from '@angular/core';


@Component({
    selector: 'editor',
    template: ''
})
export class EditorComponent {
    
    @Input() code
    codeMirror: CodeMirror;
    constructor(el:ElementRef){
        console.log(this.code)
        this.codeMirror = CodeMirror( el.nativeElement, {
            value: "SELECT * \nFROM funcionario\nWHERE chave = \"9798765T4\"",
            lineNumbers: true,
            mode:  "text/x-sql"
        } );
    }
    ngOnChanges(changes){
        console.log(changes)
        console.log(this.code)
    }
}