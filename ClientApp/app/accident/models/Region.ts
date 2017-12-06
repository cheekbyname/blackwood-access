import { Email } from "./Email";
import { Location } from "./Location";

export class Region {
    public id: number;
    public name: string;

    public emails: Email[];
    public locations: Location[];
}