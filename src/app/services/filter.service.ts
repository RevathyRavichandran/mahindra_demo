import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
//   private dbUrl = 'https://compute.twixor.digital/d/project/twixor_multisurvey/api/';

  arnlist(config: any): Observable<any> {
    const url = `${environment.baseURL}ARN_List_Corporate`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  filelist(config: any): Observable<any> {
    const url = `${environment.baseURL}File_Corporate_list`;
    return this.http.post<any>(
        url,
        config
    );
  }

  constructor(private http: HttpClient) {}
}