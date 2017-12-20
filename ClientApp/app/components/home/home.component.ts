import { Component } from '@angular/core';

import { AccessUser } from '../../models/AccessUser';

import { UserProvider } from '../../user.provider';

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {

    user: AccessUser;

    constructor(private userPro: UserProvider) {
        this.userPro.userInfo$.subscribe(ui => this.user = ui);
        this.userPro.GetUserInfo();
    }
}
