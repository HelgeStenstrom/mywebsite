import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn) => {

  const httpRequest = req.clone({
    withCredentials: true,
  });

  return next(httpRequest);
};
