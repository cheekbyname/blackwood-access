import { Component, Input, Output, EventEmitter } from "@angular/core";

import { CarerContract } from "../../models/payroll/Contract";

@Component({
    selector: 'contract-info',
    templateUrl: 'contract.info.component.html',
    styleUrls: ['contract.info.component.css']
})
export class ContractInfoComponent {

    @Input()
    contract: CarerContract;
    @Input()
    contractVisible: boolean = false;

    @Output()
    contractVisibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    public close() {
        this.contractVisible = false;
        this.contractVisibleChange.emit(this.contractVisible);
    }
}
