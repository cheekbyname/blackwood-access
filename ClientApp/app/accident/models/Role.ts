import { Person } from "./Person";

export class Role {
    public id: number;
    public description: string;

    public people: Person[];
}