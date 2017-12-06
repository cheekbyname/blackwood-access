import { PersonInvolved } from "./PersonInvolved";

export class Involvement {
    public id: number;
    public description: string;
    public isActive: boolean;

    public peopleInvolved: PersonInvolved;
}