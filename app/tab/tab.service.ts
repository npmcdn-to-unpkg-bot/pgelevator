

export class Tab{
    type:string
    active:boolean
}

export class TabService{
    static tabs:Tab[] = []
    static active:Tab
    static add(tab:Tab) {
        if ( this.active )
            this.active.active = false;
        TabService.tabs.splice(0,0,tab)
        this.active = tab;
        tab.active = true;
    }
    static activate(tab:Tab) {
        tab.active = true
        if ( this.active )
            this.active.active = false;
        this.active = tab;
    }
}