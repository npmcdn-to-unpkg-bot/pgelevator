import { Component } from '@angular/core';
import {QueryTabComponent} from '../tab/query-tab/query-tab.component'
import {TabService} from '../tab/tab.service'

@Component({
  selector: 'tab-content',
  directives: [QueryTabComponent],
  template: `
    <query-tab data="TabService.activeTab"></query-tab>
  `
})
export class TabContentComponent {
  TabService:TabService
  constructor(){
    this.TabService = TabService
  }
 }
 /*
 import { bootstrap } from '@angular/platform-browser-dynamic';
import { Directive, Component, Input, Output, DynamicComponentLoader, ComponentRef, ElementRef, ViewContainerRef, Injector } from '@angular/core';
import { UnlessDirective }          from './unless.directive';
import { HeavyLoaderComponent }     from './heavy-loader.component';

@Component({
  selector: 'a',
  template: 'xxx<div></div>2a{{random}}'
})
class A{
  random = "-"
  constructor(){
    console.log('constructed..')
    setTimeout(()=>{
      
    setInterval(()=>{this.random=Math.random()},500)
    },1000)
  }
  ngOnDestroy(){
    console.log('destroy')
  }
}
 

@Component({
  selector: 'app',
  template: ''
})
class AppComponent{
  x = Math.random()
  constructor(private loader:DynamicComponentLoader, 
  private el: ElementRef,
  private view: ViewContainerRef, private injector: Injector){
      
  }
  ngAfterViewInit(){
     var ref;
     setInterval(()=>{
       
     this.loader.loadNextToLocation(A,this.view,this.injector).then((ref2)=>{
       
       if ( ref )
        ref.destroy();
        
       ref = ref2;
       this.el.nativeElement.innerHTML = ''
       this.el.nativeElement.appendChild(ref.location.nativeElement)
       
     })
     },2000)
  }
}

bootstrap(AppComponent);
*/