
export class PanelModel{
    type:string
    active:boolean
    title:string
    activateDeactivate:number=0
}

export var PanelsService = {

    models: [] as PanelModel[],

    active: null as PanelModel,

    add(tab:PanelModel) {
        tab.activateDeactivate = 0
        if ( PanelsService.active )
            PanelsService.active.active = false;
        PanelsService.models = [tab].concat(PanelsService.models)
        PanelsService.active = tab;
        tab.active = true;
    },

    activate(tab:PanelModel) {
        if ( tab === this.active )return;
        tab.active = true
        tab.activateDeactivate++
        if ( PanelsService.active )
            PanelsService.active.active = false;
        PanelsService.active = tab;
    },

    close(tab:PanelModel){
        this.models = this.models.filter((t)=>t!=tab)
        if ( this.active == tab ) {
            tab.active = false;
            this.active = this.models[0] || null;
            this.active && (this.active.active = true);
        }
    }
}