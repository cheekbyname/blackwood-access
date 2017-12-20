import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { SliderModule } from 'primeng/primeng';

import { CareInitialAssessment } from '../../models/CareInitialAssessment';

import { InitialAssessProvider } from '../initialassess.provider';

@Component({
    selector: 'initial-assess',
    templateUrl: './initialassess.component.html',
    styleUrls: ['./initialassess.component.css']
})
export class InitialAssessComponent implements OnInit {
    public assess: CareInitialAssessment = new CareInitialAssessment();
    public section: string = "assessment";

    constructor(private route: ActivatedRoute, private router: Router, private assPro: InitialAssessProvider) {

    }

    ngOnInit() {
        this.route.params
            .switchMap((params: Params) => this.assPro.getAssessment(+params['id']))
            .subscribe((res) => {
                console.log(res.json());
                this.assess = res.json();
            });
    }

    selectSection(section) {
        this.section = section;
        window.location.hash = '';
        window.location.hash = section;
    }
}