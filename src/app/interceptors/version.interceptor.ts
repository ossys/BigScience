import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';

import { Constants } from '../constants';

@Injectable()
export class VersionInterceptor implements HttpInterceptor {
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const versReq = req.clone({
            headers: req.headers.set('Accept', 'application/json; version=' + Constants.API_VERSION)
        });
        return next.handle(versReq).catch((error, caught) => {
            return Observable.throw(error);
        }) as any;
    }
}
