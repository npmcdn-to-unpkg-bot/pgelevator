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
var http_1 = require('@angular/http');
var pg_service_1 = require("./shared/pg.service");
var PgElevatorComponent = (function () {
    function PgElevatorComponent(pg) {
        var _this = this;
        this.pg = pg;
        this.left = 200;
        this.cursor = null;
        this.clientX = null;
        this.mousemove = function (e) {
            var l = _this.lastLeft + e.clientX - _this.clientX;
            if (l < 50)
                l = 50;
            if (l > document.body.offsetWidth - 50)
                l = document.body.offsetWidth - 50;
            _this.left = l;
        };
        this.mouseleave = function () {
            _this.clientX = null;
            _this.lastLeft = null;
            window.removeEventListener("mousemove", _this.mousemove);
            window.removeEventListener("mouseleave", _this.mouseleave);
        };
        pg
            .query("select * from pg_stat_activity")
            .subscribe(function (data) { console.log(data); });
    }
    PgElevatorComponent.prototype.enter = function () {
        var _this = this;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(function () {
            _this.cursor = "w-resize";
        }, 150);
    };
    PgElevatorComponent.prototype.leave = function () {
        clearTimeout(this.timeout);
        this.cursor = null;
    };
    PgElevatorComponent.prototype.mousedown = function (e) {
        this.clientX = e.clientX;
        this.lastLeft = this.left;
        window.addEventListener('mousemove', this.mousemove);
        window.addEventListener('mouseup', this.mouseleave);
    };
    PgElevatorComponent.prototype.ngOnDestroy = function () {
        window.removeEventListener("mousemove", this.mousemove);
        window.removeEventListener("mouseleave", this.mouseleave);
    };
    PgElevatorComponent = __decorate([
        core_1.Component({
            selector: 'pg-elevator',
            directives: [nav_component_1.NavComponent, tab_content_component_1.TabContentComponent, tabs_component_1.TabsComponent, editor_component_1.EditorComponent],
            providers: [http_1.HTTP_PROVIDERS, pg_service_1.PgService],
            template: "\n   <nav [style.width.px]=left style=\"position: absolute; left: 0; top: 0; bottom: 0; \"></nav>\n   <tabs [style.left.px]=left style=\"position: absolute; top: 0; right: 0; height: 30px;\"></tabs>\n   <tab-content [style.left.px]=left style=\"position: absolute; top: 30px; bottom: 0; right: 0;\"></tab-content>\n   <div [style.left.px]=\"left-2\" [style.cursor]=\"cursor\" \n        (mouseenter)=\"enter()\" (mouseleave)=\"leave()\" (mousedown)=\"mousedown($event)\"\n        style=\"position:absolute;width:4px;top:0;bottom:0;\"></div>\n  "
        }), 
        __metadata('design:paramtypes', [pg_service_1.PgService])
    ], PgElevatorComponent);
    return PgElevatorComponent;
}());
exports.PgElevatorComponent = PgElevatorComponent;
//# sourceMappingURL=pg-elevator.component.js.map