import { Component } from '@angular/core';

import { InitialAssessProvider } from '../../careassessments/initialassess.provider';
import { PayrollProvider } from '../../payroll/payroll.provider';
import { UserProvider } from "../../user.provider";

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css', '../../assets/century-gothic.css'],
    providers: [ InitialAssessProvider, PayrollProvider, UserProvider]
})
export class AppComponent {
    constructor(private userPro: UserProvider) {
        this.userPro.GetUserInfo();
    }
}
