import { Component } from '@angular/core';
import {NavComponent} from './nav/nav.component';
import {TabContentComponent} from './tab-content/tab-content.component';
import {TabsComponent} from './tabs/tabs.component';
import {EditorComponent} from './editor/editor.component';
import { HTTP_PROVIDERS }    from '@angular/http';
import {PgService} from "./shared/pg.service";
import Timer = NodeJS.Timer;

@Component({
  selector: 'pg-elevator',
  directives: [NavComponent,TabContentComponent,TabsComponent,EditorComponent],
  providers: [HTTP_PROVIDERS, PgService],
  template: `
   <nav [style.width.px]=left style="position: absolute; left: 0; top: 0; bottom: 0; overflow: auto"></nav>
   <tabs [style.left.px]=left style="position: absolute; top: 0; right: 0; height: 30px;"></tabs>
   <tab-content [style.left.px]=left style="position: absolute; top: 30px; bottom: 0; right: 0;"></tab-content>
   <div [style.left.px]="left-2" [style.cursor]="cursor" 
        (mouseenter)="enter()" (mouseleave)="leave()" (mousedown)="mousedown($event)"
        style="position:absolute;width:4px;top:0;bottom:0;"></div>
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
  
  constructor(private pg: PgService){
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
    
    pg
        .query("select * from pg_stat_activity")
        .subscribe((data) => { console.log(data)})

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