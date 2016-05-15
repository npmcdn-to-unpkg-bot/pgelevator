
export class PanelModel{
    type:string
    active:boolean
    title:string
}

export var PanelsService = {

    models: [] as PanelModel[],

    active: null as PanelModel,

    add(tab:PanelModel) {
        if ( PanelsService.active )
            PanelsService.active.active = false;
        PanelsService.models = [tab].concat(PanelsService.models)

        PanelsService.active = tab;
        tab.active = true;
    },

    activate(tab:PanelModel) {
        if ( tab === this.active )return;
        tab.active = true
        if ( PanelsService.active )
            PanelsService.active.active = false;
        PanelsService.active = tab;
    }
}