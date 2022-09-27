import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { finalize } from 'rxjs/operators';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(public NgxUiLoaderService: NgxUiLoaderService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    this.NgxUiLoaderService.start();
    const req = request.clone({
      headers: new HttpHeaders({
        "authentication-token": 'O+dhNvcqacc2nkMwzStEqgtVJdc1+xO1VQghyITmDtwfXZJCEMLuKFgxM9RtZPcl'
      })
    });
    return next.handle(req).pipe(
      finalize(
        () => {
          this.NgxUiLoaderService.stop();
        }
      )
    );
  }
}