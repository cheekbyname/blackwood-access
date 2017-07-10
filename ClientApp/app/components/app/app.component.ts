import { Component } from '@angular/core';

import { InitialAssessProvider } from '../../careassessments/initialassess.provider';
import { TimesheetProvider } from '../../timesheets/timesheet.provider';
import { UserProvider } from "../../user.provider";

@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [require('./app.component.css')],
    providers: [ InitialAssessProvider, TimesheetProvider, UserProvider]
})
export class AppComponent {
    constructor(private userPro: UserProvider) {
        this.userPro.GetUserInfo();
    }
}
