import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MarketUpdateService {
//   private dbUrl = 'https://compute.twixor.digital/d/project/twixor_multisurvey/api/';

  marketList(config: any): Observable<any> {
    const url = `${environment.baseURL}Market_updates_pagination`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  marketCSV(config: any): Observable<any> {
    const url = `${environment.baseURL}Market_updates_Report`;
    return this.http.post<any>(
        url,
        config
    );
  }

  constructor(private http: HttpClient) {}
}