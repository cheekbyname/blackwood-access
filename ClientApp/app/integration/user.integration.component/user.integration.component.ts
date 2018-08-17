import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

import { User, ROLES } from "../../models/integration/User";

import { Utils } from "../../Utils";

import { IntegrationProvider } from "../integration.provider";
import { BehaviorSubject, Observable, Subscription } from "rxjs";

@Component({
	selector: "user-integration",
	templateUrl: "./user.integration.component.html",
	styleUrls: ["./user.integration.component.css"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserIntegrationComponent implements AfterViewInit, OnDestroy {
	constructor(private ip: IntegrationProvider, private cd: ChangeDetectorRef, private route: ActivatedRoute,
		private loc: Location) { }

	ngAfterViewInit() {
		this.cd.detach();

		this.ip.integrationUsers$.subscribe(au => { this.users = au });

		this.subs.push(Observable
			.combineLatest(this.ip.integrationUsers$, this.route.queryParams, (u, p) => { return { "users": u, "params": p } })
			.filter(x => x.users != null)
			.subscribe(x => {
				if (x.params['search'] != undefined) {
					this.searchTerm = x.params['search'];
				}
				this.onSearchChanged(this.searchTerm);
			}));

		this.subs.push(this.searchTerm$
			.switchMap(term => {
				return this.filterUsers(term);
			})
			.subscribe(users => {
				this._filteredUsers.next(users);

				this.filtering = false;
				this.cd.detectChanges();
			}));
	}

	ngOnDestroy() {
		this.subs.forEach(sub => sub.unsubscribe());
	}

	private _searchTerm: BehaviorSubject<string> = new BehaviorSubject<string>('');
	private _filteredUsers: BehaviorSubject<User[]> = new BehaviorSubject<User[]>(null);

	private searchTerm$ = this._searchTerm.debounceTime(250);
	public filteredUsers$ = this._filteredUsers.asObservable();

	private subs: Subscription[] = [];

	public users: User[];
	public searchTerm: string = '';
	public filtering: boolean = false;

	public Utils = Utils;
	public ROLES = ROLES;

	public onSearchChanged(term: string) {
		// Clear out list and notify user
		if (term != '') {
			this.loc.go('integration/users', `search=${term}`);
		} else {
			this.loc.go('integration/users');
		}

		this.filtering = true;
		this._filteredUsers.next(null);
		this.cd.detectChanges();
		this._searchTerm.next(term);
	}

	private filterUsers(term: string): Observable<User[]> {
		// Trap nulls
		if (this.users == null || term == null) return Observable.of([]);

		// Filter on lowercase
		term = term.toLowerCase();
		var filteredUsers = this.users.filter(user =>
			(user.firstName + ' ' + user.lastName).toLowerCase().includes(term)
		);
		return Observable.of(filteredUsers);
	}

	public refreshUsers() {
		this.users = null;
		this.cd.detectChanges();
		this.ip.getAllUsers().subscribe(x => this.cd.detectChanges());
	}
}
