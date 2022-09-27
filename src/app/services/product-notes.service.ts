import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductNotesService {
//   private dbUrl = 'https://compute.twixor.digital/d/project/twixor_multisurvey/api/';

  productList(config: any): Observable<any> {
    const url = `${environment.baseURL}Product_Notes_Pagination`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  productCSV(config: any): Observable<any> {
    const url = `${environment.baseURL}Product_Notes_CSV`;
    return this.http.post<any>(
        url,
        config
    );
  }

  arnlist(config: any): Observable<any> {
    const url = `${environment.baseURL}Product_Notes_ARN`;
    console.log('url--->', config)
return this.http.post<any>(
        url,
        config
    );
  }

  filelist(config: any): Observable<any> {
    const url = `${environment.baseURL}Product_Notes_File`;
    return this.http.post<any>(
        url,
        config
    );
  }

  constructor(private http: HttpClient) {}
}