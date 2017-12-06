import { AccidentUser } from "./AccidentUser";
import { Location } from "./Location";

export class UserUnit {
    public id: number;
    public userId: number;
    public unitId: number;

    public user: AccidentUser;
    public unit: Location;
}