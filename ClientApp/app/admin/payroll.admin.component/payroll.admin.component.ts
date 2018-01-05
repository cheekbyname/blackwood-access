import { Component, ViewEncapsulation } from "@angular/core";
import { NgForm, FormBuilder, FormGroup, FormControl, FormArray } from "@angular/forms";

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
    types: PayrollCodeType[];
    form: FormGroup;
    savedForm: any;

    get maps(): FormArray {
        return this.form.get('maps') as FormArray;
    }

    setCodeMapGroups(maps: PayrollCodeMap[]) {
        this.form.setControl('maps', this.fb.array(maps.map(map => this.codeMapFormGroup(map))));
    }

    codeMapFormGroup(map: PayrollCodeMap): FormGroup {
        return this.fb.group({
            type: [{ value: map.type, disabled: true}],
            typeCode: map.typeCode,
            code: map.code || '',
            payHours: map.payHours || true,
            payInstance: map.payInstance || false,
            shiftCode: map.shiftCode || false,
            payGaps: [{ value: map.payGaps || (map.type == 1), disabled: map.type == 0 }]
        });
    };

    typeDesc(code: PayrollCodeMap): string {
        var type = this.types.find(ty => ty.type == code.type && ty.code == code.typeCode);
        return type == undefined ? "Unknown" : type.description;
    }

    undoChanges(form: NgForm) {
        this.setCodeMapGroups(this.codeMap);
        this.form.markAsPristine();
    }

    unmappedTypes(): PayrollCodeType[] {
        let types = this.maps.getRawValue().map(map => { return {
            type: map.type,
            typeCode: map.typeCode
        }});
        return this.types.filter(ty => !(types.some(map => map.type == ty.type && map.typeCode == ty.code)));
    }

    addMap(type: PayrollCodeType) {
        this.cs.confirm({
            header: 'Confirm Payroll Code Mapping',
            message: 'Are you sure you want to map a Payroll Code to the "' + type.description + '" Booking Type?',
            accept: () => {
                let newMap = new PayrollCodeMap(type.type, type.code);
                this.maps.push(this.codeMapFormGroup(newMap));
                this.maps.at(this.maps.length - 1).markAsDirty();
            }
        })
    }

    removeMap(idx: number, code: PayrollCodeMap) {
        this.cs.confirm({
            header: 'Confirm Mapping Removal',
            message: 'Are you sure you want to remove the mapping for "' + this.typeDesc(code) + '"?',
            accept: () => {
                this.maps.removeAt(idx);
                this.form.markAsDirty();
            }
        })
    }
}