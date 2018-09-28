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
        const zeroDay = new Date("1899-12-30T00:00:00");
        var diffMs = new Date(dt).getTime() - zeroDay.getTime();
        var diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return (diffDays + this.Loc.firstDayOfWeek) % 7;
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
