import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Constants } from '../../constants';
import { Response } from '../../models/response';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  constructor(private http: HttpClient) { }
    
  login(username: string, password: string): Observable<Response> {
    return this.http.post<Response>(Constants.URL.LOGIN, {
        username: username,
        password: password
      }, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json; version=' + Constants.API_VERSION)
    });
  }
}
