import { Component } from '@angular/core';

@Component({
  selector: 'tab-content',
  template: 'tab content',
  styles: [`
    :host-context { position: absolute; left: 200px; top: 20px; bottom: 0; right: 0; }
  `]
})
export class TabContentComponent { }