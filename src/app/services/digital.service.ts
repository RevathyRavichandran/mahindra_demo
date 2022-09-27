import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DigitalService {
//   private dbUrl = 'https://compute.twixor.digital/d/project/twixor_multisurvey/api/';

  digitalList(config: any): Observable<any> {
    const url = `${environment.baseURL}Digital_pagination`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  digitalCSV(config: any): Observable<any> {
    const url = `${environment.baseURL}Digital_CSV`;
    return this.http.post<any>(
        url,
        config
    );
  }

  arnlist(config: any): Observable<any> {
    const url = `${environment.baseURL}Digital_ARN`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  filelist(config: any): Observable<any> {
    const url = `${environment.baseURL}Digital_File`;
    return this.http.post<any>(
        url,
        config
    );
  }


  constructor(private http: HttpClient) {}
}