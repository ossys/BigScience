import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Constants } from '../../constants';
import { LoginResponse } from '../../models/login-response';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }
    
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(Constants.URL.LOGIN, {
        username: username,
        password: password
      }, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
