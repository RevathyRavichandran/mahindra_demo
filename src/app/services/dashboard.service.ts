import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
//   private dbUrl = 'https://compute.twixor.digital/d/project/twixor_multisurvey/api/';

corporateDeckChart(config: any): Observable<any> {
    const url = `${environment.baseURL}Corporate_DEck_chart`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  marketUpdatesChart(config: any): Observable<any> {
    const url = `${environment.baseURL}Market_Updates_Chart`;
    return this.http.post<any>(
        url,
        config
    );
  }

  productInfoChart(config: any): Observable<any> {
    const url = `${environment.baseURL}Product_Info_chart`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  digitalChart(config: any): Observable<any> {
    const url = `${environment.baseURL}Digital_Factsheet_Chart`;
    return this.http.post<any>(
        url,
        config
    );
  }

  overallChart(config: any): Observable<any> {
    const url = `${environment.baseURL}overALLReport`;
    return this.http.post<any>(
        url,
        config
    );
  }

  countAPI(config: any): Observable<any> {
    const url = `${environment.baseURL}countAPI`;
    return this.http.post<any>(
        url,
        config
    );
  }

  constructor(private http: HttpClient) {}
}