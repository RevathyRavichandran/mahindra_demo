import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OnePagerService {
//   private dbUrl = 'https://compute.twixor.digital/d/project/twixor_multisurvey/api/';

  onepagerList(config: any): Observable<any> {
    const url = `${environment.baseURL}Onepager_pagination`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  onepagerCSV(config: any): Observable<any> {
    const url = `${environment.baseURL}Onepager_Report`;
    return this.http.post<any>(
        url,
        config
    );
  }

  arnlist(config: any): Observable<any> {
    const url = `${environment.baseURL}ARN_One_Page`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  filelist(config: any): Observable<any> {
    const url = `${environment.baseURL}Onepage_File`;
    return this.http.post<any>(
        url,
        config
    );
  }

  constructor(private http: HttpClient) {}
}