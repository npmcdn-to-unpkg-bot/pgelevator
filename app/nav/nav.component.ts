import { Component } from '@angular/core';

@Component({
  selector: 'nav',
  template: `
    <div class="schema" *ngFor="let schema of schemas">
      {{schema.name}}
    </div>
  `,
  styles: [`
    .schema {
        padding: 2px 0 2px 20px; position: relative;
    }
    .schema:after{
        content: ''; border-top: 6px solid transparent; border-bottom: 6px solid transparent;
        border-left: 6px solid #444;
        height: 0; display: block; position: absolute;
        left: 9px; top: 5px;
    }
  `]
})
export class NavComponent {
  schemas
  constructor(){
    var schemas = []
    for ( var c=0; c<20; c++ ) {
      schemas.push({name:'a'+c+'asdf_'+c+'asdf',open:false,tables:[]})
    }
    this.schemas = schemas;
  }
}