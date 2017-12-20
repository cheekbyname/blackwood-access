"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Utilities_1 = require("./Utilities");
var Adjustment = (function () {
    function Adjustment(carerCode, weekCommencing, dayOffset) {
        this.id = 0;
        this.carerCode = carerCode;
        this.weekCommencing = weekCommencing;
        this.dayOffset = dayOffset;
        this.hours = 0;
        this.mins = 0;
        this.guid = Utilities_1.Guid.newGuid();
    }
    Adjustment.prototype.status = function () {
    };
    return Adjustment;
}());
exports.Adjustment = Adjustment;
var AdjustmentOffsetFilter = (function () {
    function AdjustmentOffsetFilter() {
    }
    AdjustmentOffsetFilter.prototype.transform = function (adjustments, offset) {
        return adjustments.filter(function (adjust) { return adjust.dayOffset == offset; });
    };
    return AdjustmentOffsetFilter;
}());
AdjustmentOffsetFilter = __decorate([
    core_1.Pipe({
        name: 'adjustmentOffsetFilter',
        pure: false
    }),
    core_1.Injectable()
], AdjustmentOffsetFilter);
exports.AdjustmentOffsetFilter = AdjustmentOffsetFilter;
//# sourceMappingURL=adjustment.js.map