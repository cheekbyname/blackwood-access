import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { Subscription } from 'rxjs/Subscription';

import { CareInitialAssessment } from '../../models/CareInitialAssessment';

import { InitialAssessProvider } from '../initialassess.provider';

@Component({
    selector: 'initial-assess-manager',
    templateUrl: './initialassessmanager.component.html',
    styleUrls: ['./initialassessmanager.component.css']
})
export class InitialAssessManagerComponent implements OnInit {

    public assessments: CareInitialAssessment[];
    assessSub: Subscription;

    constructor(private ap: InitialAssessProvider, private router: Router) {

    }

    ngOnInit() {
        // Subscribe to provider observables
        this.assessSub = this.ap.assessments$.subscribe(ass => {
            this.assessments = ass;
        });
        // Init data
        this.ap.getAssessments();
    }

    dateFormat(parm) {
        var dt = new Date(parm);
        return dt.getDate() + '-' + (dt.getMonth() + 1) + '-' + dt.getFullYear();
    }

    selectAssess(assess: CareInitialAssessment) {
        this.router.navigate(['/initial-assess', assess.id]);
    }
}