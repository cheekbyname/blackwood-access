import { Component } from '@angular/core';

import { AccessUser } from '../../models/accessuser';
import { UserProvider } from '../../user.provider';

@Component({
    selector: 'home',
    template: require('./home.component.html')
})
export class HomeComponent {

    user: AccessUser;

    constructor(private userPro: UserProvider) {
        this.userPro.userInfo$.subscribe(ui => this.user = ui);
        this.userPro.GetUserInfo();
    }
}
