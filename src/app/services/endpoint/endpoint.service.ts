import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import 'datejs';

import { Constants } from '../../constants';
import { AppResponseModel } from '../../models/app-response.model';
import { LoginModel } from '../../models/login.model';
import { RegistrationModel } from '../../models/registration.model';
import { FileModel } from '../../models/file.model';
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
      headers: new HttpHeaders().set('Content-Type', 'application/json')
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
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  fileCreate(file: FileModel): Observable<AppResponseModel> {
    return this.http.post<AppResponseModel>(Constants.URL.FILE, {
        sha256: file.sha256,
        last_modified_date: file.lastModifiedDate.toString('u'),
        original_name: file.name,
        new_name: file.newName,
        description: file.description,
        size: file.size,
        total_chunks: file.totalChunks,
        limit: Constants.FILE.NUM_SIMULTANEOUS_UPLOADS*2
    }, {
      reportProgress: true,
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  fileGet(): Observable<AppResponseModel> {
    return this.http.get<AppResponseModel>(Constants.URL.FILE, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  chunkCreate(chunk: AppFileChunkModel): Observable<AppResponseModel> {
    const formData: FormData = new FormData();
    formData.set('file.sha256', chunk.file.sha256);
    formData.set('chunk.sha256', chunk.sha256);
    formData.set('chunk.id', chunk.id.toString());
    formData.set('chunk.startByte', chunk.startByte.toString());
    formData.set('chunk.endByte', chunk.endByte.toString());
    formData.set('chunk.data', new Blob([new Uint8Array(chunk.event.target.result)]));

    return this.http.post<AppResponseModel>(Constants.URL.CHUNK, formData, {
      reportProgress: true
    });
  }
}
