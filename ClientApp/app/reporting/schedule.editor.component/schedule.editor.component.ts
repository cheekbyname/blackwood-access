import { Component, Input, EventEmitter, Output, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

import { Observable } from "rxjs/Observable";

import { LocalAuthority } from "../../models/reporting/LocalAuthority";
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

    constructor(private rp: ReportingProvider, private fb: FormBuilder) {
        this.rp.allServices$.subscribe(s => this.services = s);
        this.rp.allTeams$.subscribe(t => this.teams = t);
        this.rp.allRegions$.subscribe(r => this.regions = r);
        this.rp.reports$.subscribe(r => this.reports = r);
        this.rp.allLocalAuthorities$.subscribe(l => this.localAuthorities = l);
    }

    ngOnInit() {
        this.form = this.fb.group({
            selectedReport: [this.sched.report, Validators.required],
            selectedFreq: [this.sched.frequency, Validators.required],
            selectedScope: [this.sched.scope, Validators.required],
            selectedTeam: [this.sched.team],
            selectedLocalAuthority: [this.sched.localAuthority],
            selectedService: [this.sched.service],
            selectedRegion: [this.sched.region],
            selectedDirection: [this.sched.direction, Validators.required],
            selectedRunTime: [this.sched.runTime, Validators.required]
        });
        this.saved = this.form.value;
    }

    @Input('selectedSched')
    set sched(sched: Schedule) {
        if (sched !== undefined && this.dataLoaded()) {
            sched.runTime = new Date(sched.runTime);
            if (sched.reportId !== null) sched.report = this.reports.find(r => r.id === sched.reportId);
            if (sched.teamId !== null) sched.team = this.teams.find(t => t.teamCode === sched.teamId);
            if (sched.serviceId !== null) sched.service = this.services.find(s => s.id === sched.serviceId);
            if (sched.regionId !== null) sched.region = this.regions.find(r => r.id === sched.regionId);
            if (sched.localAuthority !== null) sched.localAuthority = this.localAuthorities.find(l => l.ref == sched.locAuthRef);
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
    saved: any;
    proc: boolean = false;

    loc: Locale = LOC_EN;
    frequencies = FrequencyNames;
    scopes = ScopeNames;
    directions = DirectionNames;

    regions: Region[];
    reports: Report[];
    services: Service[];
    teams: Team[];
    localAuthorities: LocalAuthority[];

    public dataLoaded(): boolean {
        return this.reports !== null && this.teams !== null && this.localAuthorities !== null && this.services !== null
            && this.regions !== null;
    }

    public dismiss() {
        this.form.reset(this.saved);
        this.editVisible = false;
        this.onClose.emit();
    }

    public saveSchedule() {
        this.proc = true;
        this.rp.putSchedule(this.sched)
            .catch(e => {
                console.log(e);
                return Observable.throw(e);
            })
            .subscribe(r => {
                this.proc = false;
                this.dismiss();
            });
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

    public localAuthoritySelected() {

    }

    public regionSelected() {
        
    }
}