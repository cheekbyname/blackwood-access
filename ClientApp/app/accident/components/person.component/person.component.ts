import { Component, Input } from "@angular/core";

import { AccidentProvider } from "../../accident-provider";

import { Person } from "../../models/Person";

@Component({
    selector: 'person-card',
    templateUrl: './person.component.html',
    styleUrls: ['./person.component.css']
})
export class PersonComponent {
    constructor(private accPro: AccidentProvider) {
        this.accPro.people$.subscribe(peeps => {
            this.people = peeps;
            this.filteredNames = peeps.map(p => p.displayName);
        });
    }

    @Input()
    person: Person;

    @Input()
    description: string;

    people: Person[];
    filteredNames: string[];

    findPerson(ev: any) {

    }

    personChanged(personId: number) {
        this.person = this.people.find(p => p.id == personId);
    }
}