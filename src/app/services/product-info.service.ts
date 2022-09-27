import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductInfoService {
//   private dbUrl = 'https://compute.twixor.digital/d/project/twixor_multisurvey/api/';

  productList(config: any): Observable<any> {
    const url = `${environment.baseURL}Product_info_pagination`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  productCSV(config: any): Observable<any> {
    const url = `${environment.baseURL}Product_info_report`;
    return this.http.post<any>(
        url,
        config
    );
  }

  arnlist(config: any): Observable<any> {
    const url = `${environment.baseURL}ProductInfo_ARN`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  filelist(config: any): Observable<any> {
    const url = `${environment.baseURL}ProductInfo_File`;
    return this.http.post<any>(
        url,
        config
    );
  }

  constructor(private http: HttpClient) {}
}