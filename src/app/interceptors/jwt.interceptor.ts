import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/catch';

import { Constants } from '../constants';
import { EndpointService } from '../services/endpoint/endpoint.service';
import { StorageService } from '../services/storage/storage.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private endpointService: EndpointService,
                private storageService: StorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const jwt = this.storageService.get(Constants.LOCAL_STORAGE.JWT);
        if (jwt != null) {
            const authReq = req.clone({ headers: req.headers.set('Authorization', 'JWT ' + jwt) });
            return next.handle(authReq)
                .catch((error, caught) => {
                    return Observable.throw(error);
                }) as any;
        } else {
            return next.handle(req);
        }
    }
}