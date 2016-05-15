import { Component, OnInit, Input } from '@angular/core';
import {PgService} from "../services/pg.service";
import {ModalsService} from "../services/modals.service";

@Component({
    selector: 'login',
    template: `
    <span *ngIf="processing" class=conneting>Conneting...</span>
    <div style="width:370px" [class.shake]="shake" [style.opacity]="processing?0.5:1">
        <div class="field" [class.error]="hostError">
            <label for=host>Host: </label>
            <input id="host" [readonly]="processing" [(ngModel)]="host">
        </div>
        <div class="field" [class.error]="portError">
            <label for=port>Port: </label>
            <input id=port [readonly]="processing" [(ngModel)]="port" type="number">
        </div>
        <div class="field" [class.error]="baseError">
            <label for=base>Base: </label>
            <input id=base [readonly]="processing" [(ngModel)]="base">
        </div>
        <div class="field" [class.error]="usernameError">
            <label for=username>Username: </label>
            <input id=username [readonly]="processing" [(ngModel)]="username">
        </div>
        <div class="field" [class.error]="passwordError">
            <label for=password>Password: </label>
            <input id=password [readonly]="processing" [(ngModel)]="password" type="password">
        </div>
        <div class="actions">
            <button [disabled]=processing (click)="connect()">Connect</button>
            <span *ngIf="containError" class="connection-error">Internal error!</span>
        </div>
        <div class=special><br>
            <span (click)="special()">Or just try the example! (AngularAttack Special [lol])</span>
        </div>
</div>`,
    styles: [`
    .conneting { position: absolute; top: 10px; left: 10px; font-weight: bold; font-size: 27px; 
        background: rgba(255,255,255,.6); z-index: 1; }
    .field { margin: 10px; margin-left: 20px}
    input { padding: 5px }
    label { float: left; width: 129px; padding-top: 6px; }
    button{ padding: 10px; }
    .actions { margin: 10x; text-align: center; }
    .special { padding: 10px; text-align:right; text-decoration: underline; font-size: 13px }
    .special span { cursor: pointer; color: #333 }
    .special span:hover { color: #000 }
    .error { color: #d00 }
    .error inupt { color: #d00 }
    .connection-error { position:absolute;color:#d00;margin-top:12px;margin-left:6px }
    
    .shake { animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both; transform: translate3d(0, 0, 0); }
    
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    `]
})
export class LoginComponent  {
    host=''
    port=5432
    base="postgres"
    username="postgres"
    password=''

    hostError=false;
    portError=false;
    baseError=false;
    usernameError=false;
    passwordError=false
    shake = false
    processing = false;
    containError = false;
    private success = (res)=>{
            this.processing=false
            if ( res && typeof res.connection == 'number' ) {
                ModalsService.login = null;
            } else {
                this.containError = true
                this.shake = true
                setTimeout(()=>{this.shake=false},400)
                setTimeout(()=>{
                    this.containError = false
                },8000)
            }
    };
    private error = ()=> {
        this.processing = false
        this.containError = true
        this.shake = true
        setTimeout(()=> {
            this.shake = false
        }, 400)
        setTimeout(()=> {
            this.containError = false
        }, 8000);
    }


    connect(){
        this.port =  parseInt(this.port+'')
        this.portError = !this.port;
        this.baseError = !this.base.trim();
        this.hostError = !this.host || !this.host.match(/^([a-zA-Z0-9_]|\.)+$/);
        this.usernameError = !this.username
        this.passwordError = !this.password
        if ( this.portError || this.baseError || this.usernameError || this.passwordError ) {
            this.shake = true
            setTimeout(()=>{this.shake=false},400)
            return;
        }
        this.processing = true;

        PgService.connect({
            port: this.port,
            dbName: this.base,
            hostName: this.host,
            password: this.password,
            user: this.username
        }).subscribe(this.success,this.error);
    }
    special(){
        PgService.connectSpecial().subscribe(this.success,this.error);
    }
}