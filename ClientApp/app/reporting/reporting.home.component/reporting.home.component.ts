import { Component, Pipe, PipeTransform } from "@angular/core";
import { Http, ResponseContentType } from "@angular/http";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: 'reporting-home',
    templateUrl: 'reporting.home.component.html',
    styleUrls: ['reporting.home.component.css']
})
export class ReportingHomeComponent {
    constructor(private http: Http, private sanitizer: DomSanitizer) {
        http.get(this.reportUrl, { responseType: ResponseContentType.ArrayBuffer })
            .subscribe(res => {
                let objUrl = URL.createObjectURL(new Blob([res.blob()], { type: "application/pdf" }));
                this.reportPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(objUrl);
                console.log(objUrl);
            });
    }

    reportUrl: string = "https://hof-iis-live-01.m-blackwood.mbha.org.uk:444/api/reporting/report?reportId=1&periodStart=2018-01-01&periodEnd=2018-01-07&teamCode=132";
    reportPdfUrl: any;
}
