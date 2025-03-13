import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const mod = req.clone().params;
  //TODO: set token in authentication request
  return next(req);
};
