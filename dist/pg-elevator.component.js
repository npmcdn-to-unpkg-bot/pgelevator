"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var nav_component_1 = require('./nav/nav.component');
var tab_content_component_1 = require('./tab-content/tab-content.component');
var tabs_component_1 = require('./tabs/tabs.component');
var editor_component_1 = require('./editor/editor.component');
var PgElevatorComponent = (function () {
    function PgElevatorComponent() {
    }
    PgElevatorComponent = __decorate([
        core_1.Component({
            selector: 'pg-elevator',
            directives: [nav_component_1.NavComponent, tab_content_component_1.TabContentComponent, tabs_component_1.TabsComponent, editor_component_1.EditorComponent],
            template: "\n   <nav></nav><tabs></tabs><tab-content></tab-content>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], PgElevatorComponent);
    return PgElevatorComponent;
}());
exports.PgElevatorComponent = PgElevatorComponent;
//# sourceMappingURL=pg-elevator.component.js.map