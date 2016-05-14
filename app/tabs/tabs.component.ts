import { Component } from '@angular/core';

@Component({
  selector: 'tabs',
  template: 'tabs',
  styles: [`
    :host-context { position: absolute; left: 200px; top: 0; right: 0; height: 20px; }
  `]
})
export class TabsComponent { }