import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Constants } from '../../constants';
import { AppResponse } from '../../models/app-response';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  constructor(private http: HttpClient) { }
    
  login(email: string, password: string): Observable<AppResponse> {
    return this.http.post<AppResponse>(Constants.URL.LOGIN, {
        email: email,
        password: password
      }, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json; version=' + Constants.API_VERSION)
    });
  }

  register(email: string, username: string, first_name: string, last_name: string, password: string): Observable<AppResponse> {
    return this.http.post<AppResponse>(Constants.URL.REGISTER, {
        email: email,
        username: username,
        first_name: first_name,
        last_name: last_name,
        password: password
      }, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json; version=' + Constants.API_VERSION)
    });
  }
}
