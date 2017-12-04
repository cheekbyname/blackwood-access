import { Component } from "@angular/core";

import { UserProvider } from "../../user.provider";

@Component({
    selector: 'admin-main',
    template: require('./accident.main.component.html')
})
export class AccidentMainComponent {
    constructor(private userPro: UserProvider) {

    }
}
