import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(Constants.URL.LOGIN, {
      email: email,
      password: password
    });
  }
}
