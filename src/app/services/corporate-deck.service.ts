import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CorporateDeckService {
  private dbUrl = 'https://compute.twixor.digital/d/project/twixor_multisurvey/api/';

  corporateList(config: any): Observable<any> {
    const url = `${environment.baseURL}corporate_pagination`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  corporateCSV(config: any): Observable<any> {
    const url = `${environment.baseURL}Corporate_report`;
    return this.http.post<any>(
        url,
        config
    );
  }

  constructor(private http: HttpClient) {}
}