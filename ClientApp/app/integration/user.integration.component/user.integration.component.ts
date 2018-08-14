import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from "@angular/core";

import { User } from "../../models/integration/User";

import { Utils } from "../../Utils";

import { IntegrationProvider } from "../integration.provider";
import { BehaviorSubject } from "rxjs";

@Component({
	selector: "user-integration",
	templateUrl: "./user.integration.component.html",
	styleUrls: ["./user.integration.component.css"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserIntegrationComponent implements AfterViewInit {
	constructor(private ip: IntegrationProvider, private cd: ChangeDetectorRef) {
		ip.integrationUsers$.subscribe(au => {
			this.users = au;
			this.filteredUsers = this.users;
			this.cd.detectChanges();
		});

		/* Filter users on searchbox contents */
		this.searchTerm$ //.switchMap(term => term)
			.subscribe(term => {
				if (this.users == null) {
					this.filteredUsers = this.users;
				} else {
					term = term.toLowerCase();
					this.filteredUsers = this.users.filter(user =>
						(user.firstName + " " + user.lastName).toLowerCase().includes(term)
					);
				}
				this.filtering = false;
				this.cd.detectChanges();
			});
	}

	ngAfterViewInit() {
		this.cd.detach();
	}

	private _searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>(
		null
	);

	private searchTerm$ = this._searchTerm.asObservable()
		.delay(200).debounceTime(200);

	public users: User[];
	public filteredUsers: User[];
	public Utils = Utils;
	public filtering: boolean = false;

	public roleDesc(role: string): string {
		switch (role) {
			case "spt":
				return "Staff";
			case "usr":
				return "Client";
		}
	}

	public onSearchChanged(term: string) {
		this.filtering = true;
		this.filteredUsers = null;
		this.cd.detectChanges();
		this._searchTerm.next(term);
	}

	public trackByFn(index, item: User) {
		return item.personCode;
	}
}
