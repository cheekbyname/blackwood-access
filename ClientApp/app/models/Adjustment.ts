import { Injectable, Pipe, PipeTransform } from '@angular/core';

import { Guid } from './Utilities';

export class Adjustment {
    public id: number;
    public guid: Guid;
	public carerCode: number;
	public weekCommencing: Date;
    public requestedBy: string;
    public requested: Date;
    public authorisedBy: string;
    public authorised: Date;
    public rejectedBy: string;
    public rejected: Date;
    public contractCode: number;
    public dayOffset: number;
    public reason: string;
    public hours: number;
    public mins: number;

    constructor(carerCode:number, weekCommencing: Date, dayOffset: number) {
        this.id = 0;
        this.carerCode = carerCode;
        this.weekCommencing = weekCommencing;
        this.dayOffset = dayOffset;
        this.hours = 0;
        this.mins = 0;
        this.guid = Guid.newGuid();
    }

    public status() {

    }
}

@Pipe({
    name: 'adjustmentOffsetFilter',
    pure: false
})
@Injectable()
export class AdjustmentOffsetFilter implements PipeTransform {
    transform(adjustments: Adjustment[], offset: number): Adjustment[] {
        return adjustments.filter(adjust => adjust.dayOffset == offset);
    }
}