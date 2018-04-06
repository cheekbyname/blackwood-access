import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Locale, LOC_EN } from "../../models/Locale";
import { Region } from "../../models/reporting/Region";
import { Report } from "../../models/reporting/Report";
import { Schedule } from "../../models/reporting/Schedule";
import { ScopeNames, Frequency, FrequencyNames, DirectionNames } from "../../models/reporting/Enums";
import { Service } from "../../models/reporting/Service";
import { Team } from "../../models/payroll/Team";

import { ReportingProvider } from "../reporting.provider";

@Component({
    selector: 'schedule-editor',
    templateUrl: 'schedule.editor.component.html',
    styleUrls: ['schedule.editor.component.css']
})
export class ScheduleEditorComponent implements OnInit {

    constructor(private repPro: ReportingProvider, private fb: FormBuilder) {
        this.repPro.allServices$.subscribe(s => this.services = s);
        this.repPro.allTeams$.subscribe(t => this.teams = t);
        this.repPro.allRegions$.subscribe(r => this.regions = r);
        this.repPro.reports$.subscribe(r => this.reports = r);
    }

    ngOnInit() {
        this.form = this.fb.group({
            selectedReport: [this.sched.report, Validators.required],
            selectedFreq: [this.sched.frequency, Validators.required],
            selectedScope: [this.sched.scope, Validators.required],
            selectedTeam: [this.sched.team],
            selectedService: [this.sched.service],
            selectedRegion: [this.sched.region],
            selectedDirection: [this.sched.direction, Validators.required],
            selectedRunTime: [this.sched.runTime, Validators.required]
        });
    }

    @Input('selectedSched')
    set sched(sched: Schedule) {
        if (sched !== undefined) {
            sched.runTime = new Date(sched.runTime);
            if (sched.reportId !== null && this.reports !== null) sched.report = this.reports.find(r => r.id === sched.reportId);
            if (sched.teamId !== null && this.teams !== null) sched.team = this.teams.find(t => t.teamCode === sched.teamId);
            if (sched.serviceId !== null && this.services !== null) sched.service = this.services.find(s => s.id === sched.serviceId);
            if (sched.regionId !== null && this.regions !== null) sched.region = this.regions.find(r => r.id === sched.regionId);
        }
        this._sched = sched;
    };
    get sched(): Schedule { return this._sched};

    @Input()
    public editVisible: boolean;
    @Output()
    public onClose: EventEmitter<void> = new EventEmitter<void>();

    private _sched: Schedule;

    form: FormGroup;

    loc: Locale = LOC_EN;
    frequencies = FrequencyNames;
    scopes = ScopeNames;
    directions = DirectionNames;

    regions: Region[];
    reports: Report[];
    services: Service[];
    teams: Team[];

    public dismiss() {
        this.editVisible = false;
        this.onClose.emit();
    }

    public saveSchedule() {

    }

    public reportSelected() {

    }

    public scopeSelected() {

    }

    public directionSelected() {

    }

    public teamSelected() {

    }

    public serviceSelected() {

    }

    public regionSelected() {
        
    }
}