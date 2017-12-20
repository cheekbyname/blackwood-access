import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

import { Observable } from "rxjs/Rx";

import { AccidentProvider } from "../accident-provider";
import { UserProvider } from "../../user.provider";

import { IncidentSummary } from "../models/IncidentSummary";

@Component({
    selector: 'admin-main',
    templateUrl: './accident.main.component.html',
    styleUrls: ['./accident.main.component.css']
})
export class AccidentMainComponent {
    constructor(private userPro: UserProvider, private accPro: AccidentProvider, private loc: Location,
        private route: ActivatedRoute) {
        this.accPro.summaries$.subscribe(sum => {
            this.summaries = sum;
        });
        this.accPro.errors$.subscribe(err => {
            if (err !== null) this.errored = true;
        });
        this.route.queryParams.subscribe(p => {
            var term = p["searchTerm"];
            if (term) {
                this.searchTerm = term;
                this.searchChanged(term);
            }
        });
    }

    public errored: boolean = false;
    public searchTerm: string;
    public summaries: IncidentSummary[];

    public searchChanged(term: string) {
        if (term == "") {
            this.loc.go("/accident");
        } else {
            this.loc.go("/accident?searchTerm=" + term);
        }
        this.errored = false;
        this.summaries = undefined;
        this.accPro.setSearchTerm(term);
    }

    public clearSearch() {
        this.loc.go("/accident");
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
