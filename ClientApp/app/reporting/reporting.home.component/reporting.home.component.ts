import { Component, Pipe, PipeTransform } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: 'reporting-home',
    templateUrl: 'reporting.home.component.html',
    styleUrls: ['reporting.home.component.css']
})
export class ReportingHomeComponent {
    constructor(private http: Http) {
        http.get(this.reportUrl)
            .subscribe(res => {
                let objUrl = URL.createObjectURL(new Blob([res], { type: "application/pdf" }));
                this.reportPdfUrl = objUrl;
                console.log(objUrl);
            });
    }

    reportUrl: string = "https://hof-iis-live-01.m-blackwood.mbha.org.uk:444/api/reporting/report?reportId=1&periodStart=2018-01-01&periodEnd=2018-01-07&teamCode=132";
    reportPdfUrl: any;
}

@Pipe({
	name: "safeUrl"
})
export class SafeUrlPipe implements PipeTransform {
	constructor(private domSan: DomSanitizer) { }
	transform(url) {
		return this.domSan.bypassSecurityTrustResourceUrl(url);
	}
}