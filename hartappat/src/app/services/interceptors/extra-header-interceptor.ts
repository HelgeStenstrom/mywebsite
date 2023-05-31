import {HttpEvent, HttpHandler, HttpHeaderResponse, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, of, tap} from "rxjs";

export class ExtraHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req)
      .pipe(
        // Nothing to do yet
        tap(() => console.log('ExtraHeaderInterceptor could re-write the http call here'))
      );

  }

}
