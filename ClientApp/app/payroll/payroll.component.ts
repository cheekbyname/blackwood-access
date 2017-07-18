import { Component } from '@angular/core';

@Component({
    template: `
        <router-outlet></router-outlet>
        <router-outlet name="summary"></router-outlet>
        <router-outlet name="detail"></router-outlet>
    `
})
export class PayrollComponent {

}