import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";

import { ConfirmationService } from "primeng/primeng";

import { PayrollCodeMap } from "../../models/payroll/PayrollCodeMap";
import { PayrollCodeType } from "../../models/payroll/PayrollCodeType";

import { PayrollProvider } from "../../payroll/payroll.provider";

@Component({
    selector: 'payroll-admin',
    templateUrl: 'payroll.admin.component.html',
    styleUrls: ['payroll.admin.component.css']
})
export class PayrollAdminComponent {
    constructor(private pp: PayrollProvider, private cs: ConfirmationService, private fb: FormBuilder) {

        this.pp.codeMap$.subscribe(maps => {
            this.codeMap = maps;
            this.form = this.fb.group({ maps: this.fb.array([]) });
            this.setCodeMapGroups(maps);
            this.savedForm = this.form.getRawValue();   // Stash form state for reset
        });

        this.pp.codeTypes$.subscribe(ct => this.types = ct);
    }

    codeMap: PayrollCodeMap[];
    removed: PayrollCodeMap[] = [];
    types: PayrollCodeType[];
    form: FormGroup;
    savedForm: any;
    dialogVisible: boolean = false;
    errorMessage: string;

    get maps(): FormArray {
        return (<FormArray>this.form.get('maps'));
    }

    setCodeMapGroups(maps: PayrollCodeMap[]) {
        this.form.setControl('maps', this.fb.array(maps.map(map => this.codeMapFormGroup(map))));
    }

    codeMapFormGroup(map: PayrollCodeMap): FormGroup {
        return this.fb.group({
            id: map.id || 0,
            type: [{ value: map.type, disabled: true }],
            typeCode: map.typeCode,
            code: map.code || '',
            payHours: map.payHours || false,
            payInstance: map.payInstance || false,
            shiftCode: map.shiftCode || false,
            payGaps: [{ value: map.payGaps || (map.type == 1), disabled: map.type == 0 }],
            active: map.active || 1
        });
    }

    typeDesc(code: PayrollCodeMap): string {
        var type = this.types.find(ty => ty.type == code.type && ty.code == code.typeCode);
        return type == undefined ? "Unknown" : type.description;
    }

    undoChanges() {
        this.setCodeMapGroups(this.codeMap);
        this.form.markAsPristine();
    }

    saveChanges() {
        let changes = (<FormArray>this.form.get('maps'))
            .controls.filter(con => !con.pristine)
            .map(con => (<FormGroup>con).getRawValue());
        changes.forEach(ch => {
            this.pp.putCodeMap(<PayrollCodeMap>ch)
                .subscribe(
                    () => this.form.markAsPristine(),
                    err => {
                        this.errorMessage = err.statusText == "" ? "Network connection or server error." : err.statusText;
                        this.errorMessage += " If this problem persists, please contact Business Solutions or raise a Support Desk ticket.";
                        this.dialogVisible = true;
                    }
                );
        });
    }

    unmappedTypes(): PayrollCodeType[] {
        let types = this.maps.getRawValue().map(map => {
            return {
                type: map.type,
                typeCode: map.typeCode,
                active: map.active
            }
        }).filter(map => map.active);
        return this.types.filter(ty => !(types.some(map => map.type == ty.type && map.typeCode == ty.code && map.active)));
    }

    addMap(type: PayrollCodeType) {
        this.cs.confirm({
            header: 'Confirm Payroll Code Mapping',
            message: 'Are you sure you want to map a Payroll Code to the "' + type.description + '" Booking Type?',
            accept: () => {
                var rem = this.removed.findIndex(rem => rem.type == type.type && rem.typeCode == type.code);
                if (rem >= 0) {
                    this.maps.push(this.codeMapFormGroup(this.removed.splice(rem, 1)[0]));
                } else {
                    let newMap = new PayrollCodeMap(type.type, type.code);
                    this.maps.push(this.codeMapFormGroup(newMap));
                }
                this.maps.at(this.maps.length - 1).markAsDirty();
            }
        });
    }

    removeMap(idx: number, code: PayrollCodeMap) {
        this.cs.confirm({
            header: 'Confirm Mapping Removal',
            message: 'Are you sure you want to remove the mapping for "' + this.typeDesc(code) + '"?',
            accept: () => {
                let map = (<FormGroup>this.maps.at(idx));
                map.patchValue({ "active": false });
                this.removed.push(<PayrollCodeMap>map.getRawValue());
                this.maps.removeAt(idx);
                this.form.markAsDirty();
            }
        });
    }

    hideDialog() {
        this.dialogVisible = false;
    }
}