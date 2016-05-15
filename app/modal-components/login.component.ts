import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'login',
    template: `<div style="width:370px" [class.shake]="shake">
        <div class="field" [class.error]="hostError"><label for=host>Host: </label><input id="host" [(ngModel)]="host"></div>
        <div class="field" [class.error]="portError"><label for=port>Port: </label><input id=port [(ngModel)]="port" type="number"></div>
        <div class="field" [class.error]="baseError"><label for=base>Base: </label><input id=base [(ngModel)]="base"></div>
        <div class="field" [class.error]="usernameError"><label for=username>Username: </label><input id=username [(ngModel)]="username"></div>
        <div class="field" [class.error]="passwordError"><label for=password>Password: </label><input id=password [(ngModel)]="password" type="password"></div>
        <div class="actions">
            <button (click)="connect()">Connect</button>
        </div>
        <div class=special><br>
            <span (click)="special()">Or just try the exaple! (AngularAtack Special [lol])</span>
        </div>
</div>`,
    styles: [`
    .field { margin: 10px; margin-left: 20px}
    input { padding: 5px }
    label { float: left; width: 129px; padding-top: 6px; }
    button{ padding: 10px; }
    .actions { margin: 10x; text-align: center; }
    .special { padding: 10px; text-align:right; text-decoration: underline; }
    .special span { cursor: pointer; color: #333 }
    .special span:hover { color: #000 }
    .error { color: #d00 }
    .error inupt { color: #d00 }
    
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
    }
    special(){

    }
}