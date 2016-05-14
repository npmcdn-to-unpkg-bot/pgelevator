import { Component, ElementRef } from '@angular/core';


@Component({
    selector: 'editor',
    template: ''
})
export class EditorComponent {
    
    codeMirror: CodeMirror;
    constructor(el:ElementRef){
        this.codeMirror = CodeMirror( el.nativeElement, {
            value: "SELECT * \nFROM funcionario\nWHERE chave = \"9798765T4\"",
            lineNumbers: true,
            mode:  "text/x-sql"
        } );
    }
}