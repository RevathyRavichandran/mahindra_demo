import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MetricService {
//   private dbUrl = 'https://compute.twixor.digital/d/project/twixor_multisurvey/api/';

  metricsList(config: any): Observable<any> {
    const url = `${environment.baseURL}MetricAPI`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  constructor(private http: HttpClient) {}
}