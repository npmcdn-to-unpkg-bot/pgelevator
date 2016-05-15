
import { bootstrap }    from '@angular/platform-browser-dynamic';

import { PgElevatorComponent } from './core-components/pg-elevator.component';

bootstrap(PgElevatorComponent);

window.addEventListener('mousedown',(e)=>{
    var el = e.target
    if ( el instanceof HTMLElement &&
        !((el as HTMLElement).tagName in {'INPUT':true,'TEXTAREA':true,'SELECT':true,'OPTION':true}) )
        e.preventDefault();
});