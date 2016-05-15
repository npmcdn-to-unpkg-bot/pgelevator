import { Component } from '@angular/core';
import {NavComponent} from './nav.component';
import {TabContentComponent} from './tab-content.component';
import {TabsComponent} from './tabs.component';
import {EditorComponent} from '../components/editor.component';
import { HTTP_PROVIDERS }    from '@angular/http';
import {PgService} from "../services/pg.service";
import {ModalFrameComponent} from './modal-frame.component';
import {ModalsService} from '../services/modals.service'
import Timer = NodeJS.Timer;

@Component({
  selector: 'pg-elevator',
  directives: [NavComponent,TabContentComponent,TabsComponent,EditorComponent, ModalFrameComponent],
  providers: [HTTP_PROVIDERS],
  template: `
    <div *ngIf="!ModalsService.login">
     <nav [style.width.px]=left style="position: absolute; left: 0; top: 0; bottom: 0;overflow:auto "></nav>
     <tabs [style.left.px]=left style="position: absolute; top: 0; right: 0; height: 30px;"></tabs>
     <tab-content [style.left.px]=left style="position: absolute; top: 30px; bottom: 0; right: 0;"></tab-content>
   </div>
   <div [style.left.px]="left-2" [style.cursor]="cursor" 
        (mouseenter)="enter()" (mouseleave)="leave()" (mousedown)="mousedown($event)"
        style="position:absolute;width:4px;top:0;bottom:0;z-index:3"></div>
        <modal-frame></modal-frame>
  `
})
export class PgElevatorComponent { 
  left = 200
  cursor:string = null
  timeout:Timer
  lastLeft:number
  clientX:number = null
  mousemove:(e:MouseEvent)=>void
  mouseleave:()=>void
  ModalsService = ModalsService
  pg = PgService
  constructor(){
    this.mousemove = (e)=>{
      var l = this.lastLeft + e.clientX - this.clientX;
      if ( l < 50 )
        l = 50;
      if ( l > document.body.offsetWidth - 50 )
        l = document.body.offsetWidth - 50;
      this.left = l;
    }
    this.mouseleave = ()=>{
      this.clientX = null;
      this.lastLeft = null;
      window.removeEventListener("mousemove",this.mousemove);
      window.removeEventListener("mouseleave",this.mouseleave);
    };
    
  }
  
  enter(){
    clearTimeout(this.timeout);
    this.timeout = setTimeout(()=>{
      this.cursor = "w-resize"
    },150);
  }
  
  leave(){
    clearTimeout(this.timeout);
    this.cursor = null;
  }
  
  mousedown(e){
    this.clientX = e.clientX;
    this.lastLeft = this.left;
    window.addEventListener('mousemove',this.mousemove);
    window.addEventListener('mouseup',this.mouseleave)
  }
  
  ngOnDestroy(){
      window.removeEventListener("mousemove",this.mousemove);
      window.removeEventListener("mouseleave",this.mouseleave);
  }
}