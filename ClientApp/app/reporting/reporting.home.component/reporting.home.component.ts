import { Component, Pipe, PipeTransform } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { Direction, DirectionNames, Frequency, FrequencyNames, Scope, ScopeNames } from "../../models/reporting/Enums"; 
import { Locale, LOC_EN } from "../../models/Locale";
import { Report } from "../../models/reporting/Report";
import { ReportingProvider } from "../reporting.provider";

@Component({
    selector: 'reporting-home',
    templateUrl: 'reporting.home.component.html',
    styleUrls: ['reporting.home.component.css']
})
export class ReportingHomeComponent {
    constructor(private http: Http, private sanitizer: DomSanitizer, private repPro: ReportingProvider) {
        // TODO Remove this dev thing
        http.get(this.reportUrl, { responseType: ResponseContentType.ArrayBuffer })
            .subscribe(res => {
                let objUrl = URL.createObjectURL(new Blob([res.blob()], { type: "application/pdf" }));
                this.reportPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objUrl);
                console.log(objUrl);
            });

        repPro.reports$.filter(reps => reps !== null).subscribe(reps => this.reports = reps);
        repPro.selectedReport$.filter(rep => this.reports !== undefined)
            .filter(rep => rep !== undefined)
            .subscribe(rep => this.selectedReport = this.reports.find(r => r.id == rep.id));
        repPro.periodStart$.subscribe(dt => this.selectedStart = dt);
        repPro.periodEnd$.subscribe(dt => this.selectedEnd = dt);
    }

    loc: Locale = LOC_EN;

    reportUrl: string = "https://hof-iis-live-01.m-blackwood.mbha.org.uk:444/api/reporting/report?reportId=1&periodStart=2018-01-01&periodEnd=2018-01-07&teamCode=132";
    reportPdfUrl: any = null;

    reports: Report[];
    directions = DirectionNames;
    frequencies = FrequencyNames;
    scopes = ScopeNames;

    selectedReport: Report;
    selectedScope: Scope;
    selectedStart: Date;
    selectedEnd: Date;

    selectedDirection: Direction;
    selectedFrequency: Frequency;

    periodStartSelected(ev: any) {

    }

    periodEndSelected(ev: any) {

    }
}
