import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Subject } from 'rxjs';
import 'rxjs';

import { CareInitialAssessment } from '../models/CareInitialAssessment';

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

    getAssessment(id: number) {
        return this.http.get('api/careinitialassessment/careinitialassessment?id=' + id);
    }
}