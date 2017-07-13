import { Component } from '@angular/core';

import { InitialAssessProvider } from '../../careassessments/initialassess.provider';
import { PayrollProvider } from '../../payroll/payroll.provider';
import { UserProvider } from "../../user.provider";

@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [require('./app.component.css'), require('../../assets/century-gothic.css')],
    providers: [ InitialAssessProvider, PayrollProvider, UserProvider]
})
export class AppComponent {
    constructor(private userPro: UserProvider) {
        this.userPro.GetUserInfo();
    }
}
