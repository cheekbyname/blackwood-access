import { Component } from "@angular/core";

import { Observable } from "rxjs/Rx";

import { AccidentProvider } from "../accident-provider";
import { UserProvider } from "../../user.provider";

import { IncidentSummary } from "../models/IncidentSummary";

@Component({
    selector: 'admin-main',
    template: require('./accident.main.component.html'),
    styles: [require('./accident.main.component.css')]
})
export class AccidentMainComponent {
    constructor(private userPro: UserProvider, private accPro: AccidentProvider) {
        this.accPro.summaries$.subscribe(sum => {
            this.summaries = sum;
        });
        this.accPro.errors$.subscribe(err => {
            if (err !== null) this.errored = true;
        });
    }

    public errored: boolean = false;
    public searchTerm: string;
    public summaries: IncidentSummary[];

    public viewIncident(sum: IncidentSummary) {
        console.log(sum);
    }

    public searchChanged(term: string) {
        this.errored = false;
        this.summaries = undefined;
        this.accPro.setSearchTerm(term);
    }

    public clearSearch() {
        this.errored = false;
        this.summaries = undefined;
        this.accPro.setSearchTerm("");
        this.searchTerm = "";
    }

    public displayDate(dt: Date) {
        return new Date(dt).toLocaleDateString();
    }

    public displayTime(dt: Date) {
        return new Date(dt).toLocaleTimeString();
    }
}
