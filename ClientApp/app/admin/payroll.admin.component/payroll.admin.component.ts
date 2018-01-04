import { Component, ViewEncapsulation } from "@angular/core";
import { NgForm, FormBuilder, FormGroup, FormControl } from "@angular/forms";

import { ConfirmDialogModule, ConfirmationService } from "primeng/primeng";

import { PayrollCodeMap } from "../../models/PayrollCodeMap";
import { PayrollCodeType } from "../../models/PayrollCodeType";

import { PayrollProvider } from "../../payroll/payroll.provider";

@Component({
    selector: 'payroll-admin',
    templateUrl: 'payroll.admin.component.html',
    styleUrls: ['payroll.admin.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PayrollAdminComponent {
    constructor(private payPro: PayrollProvider, private conSrv: ConfirmationService, private formBuilder: FormBuilder) {

        this.payPro.codeMap$.subscribe(map => {
            this.form = this.formBuilder.group({});     // Initialise empty Form
            this.codeMap = map;
            this.codeMap.forEach(code => {
                this.addControlsForCode(code);
            });
            this.savedForm = this.form.getRawValue();   // Stash form state for reset
        });
        this.payPro.codeTypes$.subscribe(ct => this.types = ct);
    }

    codeMap: PayrollCodeMap[];
    types: PayrollCodeType[];
    form: FormGroup;
    savedForm: any;

    addControlsForCode(code: PayrollCodeMap) {
        let codeName = this.codeName(code);
        this.addControl('type', codeName, code.type, true);
        this.addControl('code', codeName, code.code);
        this.addControl('payHours', codeName, code.payHours);
        this.addControl('payInstance', codeName, code.payInstance);
        this.addControl('shiftCode', codeName, code.shiftCode);
        this.addControl('payGaps', codeName, code.payGaps, code.type == 0);
    }

    addControl(name: string, codeName: string, value: any, disable: boolean = false) {
        this.form.addControl(name + codeName, new FormControl({ value: value, disabled: disable }));
    }

    codeName(code: PayrollCodeMap): string {
        return '_' + code.type + '_' + code.typeCode;
    }

    typeDesc(code: PayrollCodeMap): string {
        var type = this.types.find(ty => ty.type == code.type && ty.code == code.typeCode);
        return type == undefined ? "Unknown" : type.description;
    }

    undoChanges(form: NgForm) {
        this.form.reset(this.savedForm);
    }

    unmappedTypes(): PayrollCodeType[] {
        return this.types.filter(ty => !(this.codeMap.some(cm => cm.type == ty.type && cm.typeCode == ty.code)));
    }

    mapCode(type: PayrollCodeType) {
        this.conSrv.confirm({
            header: 'Confirm Payroll Code Mapping',
            message: 'Are you sure you want to map a Payroll Code to the "' + type.description + '" Booking Type?',
            accept: () => {
                let newMap = new PayrollCodeMap(type.type, type.code);
                this.codeMap.push(newMap);
            }
        })
    }

    removeMap(code: PayrollCodeMap) {
        this.conSrv.confirm({
            header: 'Confirm Mapping Removal',
            message: 'Are you sure you want to remove the mapping for "' + this.typeDesc(code) + '"?',
            accept: () => {
                this.codeMap.splice(this.codeMap.indexOf(code), 1);
            }
        })
    }
}