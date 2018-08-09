import { Injectable } from "@angular/core";
import { Http } from "@angular/http";

import { Observable } from "rxjs";

@Injectable()
export class ApiProvider {
    constructor(private http: Http) { }

    get(url: string, serial: boolean) {
        
    }
}

class ApiRequest {
    url: string;
    serial: boolean;
    call: Observable<Response>;
}