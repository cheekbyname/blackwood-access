import { Component, Injectable} from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs/subject';

import { CareInitialAssessment } from '../models/careinitialassessment';

@Injectable()
export class InitialAssessProvider {

    private assessSource = new Subject<CareInitialAssessment[]>();

    assessments$ = this.assessSource.asObservable();

    constructor(private http: Http) {

    }

    getAssessments() {
        var assessments: CareInitialAssessment[];
        this.http.get('api/careinitialassessment/careinitialassessments').subscribe(res => {
            assessments = res.json();
            this.assessSource.next(assessments);
        });
    }
}