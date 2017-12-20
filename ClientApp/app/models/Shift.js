"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Shift = (function () {
    function Shift() {
    }
    return Shift;
}());
exports.Shift = Shift;
var ShiftOffsetFilter = (function () {
    function ShiftOffsetFilter() {
    }
    ShiftOffsetFilter.prototype.transform = function (shifts, offset) {
        return shifts.filter(function (shift) { return shift.day == offset; });
    };
    return ShiftOffsetFilter;
}());
ShiftOffsetFilter = __decorate([
    core_1.Pipe({
        name: 'shiftOffsetFilter'
    }),
    core_1.Injectable()
], ShiftOffsetFilter);
exports.ShiftOffsetFilter = ShiftOffsetFilter;
//# sourceMappingURL=Shift.js.map