/**
 * Created by francisco on 14/05/16.
 */
import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core'

@Component({
    selector: 'modal',
    template: `
        <div class="mask">
            <div class="content" [style.width]="width">
                <ng-content></ng-content>
            </div>
        </div>
    `,
    styles: [`
        .mask { 
            background-color: #000; opacity: .6; position: absolute; top: 0; right: 0; left: 0; bottom: 0;
            width: 100%; height: 100%; transition: all .2s;
        }
        .content { background-color: #f8f8f8; color: #404040; position: relative; margin: auto auto; 
            
        }
    `]
})
export class ModalComponent implements OnInit, OnDestroy{
    el:HTMLElement
    height
    width

    constructor(private ref: ElementRef){}

    ngOnInit():any {
        console.log('init ...')
        this.el = this.ref.nativeElement
        let content:Element = this.el.getElementsByClassName('content')[0].firstElementChild as Element
        console.log(content)
        this.height = window.getComputedStyle(content,null).getPropertyValue("height");
        this.width = window.getComputedStyle(content,null).getPropertyValue("width");

        /*let mask: HTMLElement  = document.createElement('div')
        mask.classList.add('mask')
        this.el.parentElement.insertBefore(this.el)
        mask.appendChild(this.el)*/
    }

    ngOnDestroy():any {
        console.log('destroy...')
    }
}
