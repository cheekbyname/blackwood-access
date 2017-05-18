import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/subscription';

import { CareInitialAssessment } from '../../models/careinitialassessment';
import { InitialAssessProvider } from '../../providers/initialassess.provider';

@Component({
    selector: 'initial-assess-manager',
    template: require('./initialassessmanager.component.html'),
    styles: [require('./initialassessmanager.component.css')]
})
export class InitialAssessManagerComponent implements OnInit {

    public assessments: CareInitialAssessment[];
    assessSub: Subscription;

    constructor(private http: Http, private assPro: InitialAssessProvider) {

    }

    ngOnInit() {
        // Subscribe to provider observables
        this.assessSub = this.assPro.assessments$.subscribe(ass => {
            this.assessments = ass;
        });
        // Init data
        this.assPro.getAssessments();
    }

    dateFormat(parm) {
        var dt = new Date(parm);
        return dt.getDate() + '-' + dt.getMonth() + '-' + dt.getFullYear();
    }
}