import { Component } from '@angular/core';

import { InitialAssessProvider } from '../../careassessments/initialassess.provider';
import { TimesheetProvider } from '../../timesheets/timesheet.provider';

@Component({
    selector: 'app',
    template: require('./app.component.html'),
    styles: [require('./app.component.css')],
    providers: [ InitialAssessProvider, TimesheetProvider]
})
export class AppComponent {
}
