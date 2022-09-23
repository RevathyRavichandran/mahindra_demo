import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const req = request.clone({
      headers: new HttpHeaders({
        "authentication-token": 'O+dhNvcqacc2nkMwzStEqgtVJdc1+xO1VQghyITmDtwfXZJCEMLuKFgxM9RtZPcl'
      })
    });
    return next.handle(req);
  }
}