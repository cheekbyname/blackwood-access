//import { Pipe, PipeTransform } from "@angular/core";

import { TeamUser } from "./TeamUser";
import { UserMap } from "./UserMap";

import { Guid } from "../Utilities";

export class User {
    public room: number;
    public floor: number;
    public id: number;
    public areaId: number;
    public langID: string;
    public firstName: string;
    public middleName: string;
    public lastName: string;
    public gender: string;
    public address: string;
    public roomNumber: number;
    public zippCode: string;
    public city: string;
    public phone: string;
    public emailAddress: string;
    public mobilePhone: string;
    public birthDate: Date;
    public officePhone: number;
    public keyAlarmCode: number;
    public swiftNumber: string;
    public instructions: number;
    public role: string;
    public latitude: number;
    public longitude: number;
    public photo: number;
    public mapHash: string;
    public staffPlanHash: string;
    public personCode: number;
    public cleverCogsUserID: number;
    public careSysGuid: Guid;
    public addressCode: number;
    public careSysUserName: string;
    public enableSync: boolean;
    public cs_guid: Guid;
    public notified: boolean;

    public userMap: UserMap;
    public teamUser: TeamUser;
}

// @Pipe({
//     name: 'userNameFilter'
// })
// export class UserNameFilter implements PipeTransform {
//     transform(users: User[], searchTerm: string) {
//         if (!users) return [];
//         if (!searchTerm) return users;

//         searchTerm = searchTerm.toLowerCase();

//         return users.filter(user => {
//             return (user.firstName + ' ' + user.lastName).toLowerCase().includes(searchTerm);
//         });
//     }
// }