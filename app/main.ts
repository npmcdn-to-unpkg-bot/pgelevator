
import { bootstrap }    from '@angular/platform-browser-dynamic';

import { PgElevatorComponent } from './core-components/pg-elevator.component';

bootstrap(PgElevatorComponent);

window.addEventListener('mousedown',(e)=>{
    e.preventDefault();
});