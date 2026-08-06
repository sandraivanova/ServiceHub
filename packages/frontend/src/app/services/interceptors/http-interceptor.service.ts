import {HttpInterceptorFn} from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getAccessToken();
  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  return next(authReq);
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken') ?? null;
}
