import { Component } from '@angular/core';

@Component({
  selector: 'nav',
  template: 'nav',
  styles: [`
    :host-context { position: absolute; left: 0; top: 0; bottom: 0; width: 200px; }
  `]
})
export class NavComponent { }