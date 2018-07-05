import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { Constants } from '../../constants';
import { AppResponseModel } from '../../models/app-response.model';
import { LoginModel } from '../../models/login.model';
import { RegistrationModel } from '../../models/registration.model';
import { AppFileChunkModel } from '../../models/app-file-chunk.model';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  constructor(private http: HttpClient) { }
    
  login(login: LoginModel): Observable<AppResponseModel> {
    return this.http.post<AppResponseModel>(Constants.URL.LOGIN, {
        email: login.email,
        password: login.password
      }, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json; version=' + Constants.API_VERSION)
    });
  }

  register(registration: RegistrationModel): Observable<AppResponseModel> {
    return this.http.post<AppResponseModel>(Constants.URL.REGISTER, {
        email: registration.email,
        username: registration.username,
        first_name: registration.first_name,
        last_name: registration.last_name,
        password: registration.password
      }, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json; version=' + Constants.API_VERSION)
    });
  }

  dataUpload(chunk: AppFileChunkModel): Observable<AppResponseModel> {
    return this.http.post<AppResponseModel>(Constants.URL.UPLOAD, {

      }, {
      headers: new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json; version=' + Constants.API_VERSION)
    });
  }
}
