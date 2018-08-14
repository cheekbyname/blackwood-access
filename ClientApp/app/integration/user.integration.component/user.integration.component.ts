import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit } from "@angular/core";

import { User } from "../../models/integration/User";

import { Utils } from "../../Utils";

import { IntegrationProvider } from "../integration.provider";
import { BehaviorSubject, Observable, ObjectUnsubscribedError } from "rxjs";

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
			this._filteredUsers.next(au);
			this.cd.detectChanges();
		});

		this.searchTerm$
			.switchMap(term => this.filterUsers(term))
			.subscribe(users => {
				this._filteredUsers.next(users);

				this.filtering = false;
				this.cd.detectChanges();
			});
	}

	ngAfterViewInit() {
		this.cd.detach();
	}

	private _searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>(null);
	private _filteredUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null);

	private searchTerm$ = this._searchTerm.debounceTime(250);
	public filteredUsers$ = this._filteredUsers.asObservable();

	public users: User[];
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

	public trackByFn(index, item: User) {
		return item.personCode;
	}

	public onSearchChanged(term: string) {
		// Clear out list and notify user
		this.filtering = true;
		this._filteredUsers.next(null);
		this.cd.detectChanges();

		this._searchTerm.next(term);
	}

	private filterUsers(term: string): Observable<User[]> {
		if (this.users == null) return Observable.of(null);
		term = term.toLowerCase();
		var filteredUsers = this.users.filter(user =>
			(user.firstName + ' ' + user.lastName).toLowerCase().includes(term)
		);
		return Observable.of(filteredUsers);
	}
}
