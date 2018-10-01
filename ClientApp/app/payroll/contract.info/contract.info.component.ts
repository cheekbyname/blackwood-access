import { Component, Input, Output, EventEmitter } from "@angular/core";

import { CarerContract } from "../../models/payroll/Contract";

import { PayrollProvider } from "../payroll.provider";
import { LOC_EN, Locale } from "../../models/Locale";
import { Utils } from "../../Utils";
import { Carer } from "../../models/payroll/Carer";

@Component({
    selector: 'contract-info',
    templateUrl: 'contract.info.component.html',
    styleUrls: ['contract.info.component.css']
})
export class ContractInfoComponent {

    constructor(public pp: PayrollProvider) { }

    @Input() contract: CarerContract = new CarerContract();
    @Input() carer: Carer = new Carer();
    @Input() contractVisible: boolean = false;

    @Output() contractVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public Loc: Locale = LOC_EN;
    public Utils = Utils;

    public close() {
        this.contractVisible = false;
        this.contractVisibleChange.emit(this.contractVisible);
    }

    public dayOfWeek(dt): number {
        return (Utils.DiffDays(dt) + this.Loc.firstDayOfWeek) % 7;
    }

    public weekOffset(dt): number {
        return Math.floor(Utils.DiffDays(dt) / 7) + 1;
    }

    public totalMins(): number {
        return this.contract.scheduledAvailability
            .map(avail => avail.thisMins)
            .reduce((acc, cur) => { return acc + cur }, 0);
    }

    public adjustMins(): number {
        return this.contract.scheduledAvailability
            .map(avail => this.pp.adjustAvailForBreaks(avail, this.contract))
            .reduce((acc, cur) => { return acc + cur }, 0);
    }
}
