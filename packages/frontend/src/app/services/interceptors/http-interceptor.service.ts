import {HttpErrorResponse, HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {ApiService} from "../api.service";
import {catchError, switchMap, throwError} from "rxjs";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getAccessToken();
  let authReq = req;

  const apiService = inject(ApiService);

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/token')) {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          return apiService.refreshToken(refreshToken).pipe(
            switchMap((response) => {
              localStorage.setItem('accessToken', response.accessToken);
              localStorage.setItem('refreshToken', response.refreshToken);

              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`
                }
              });
              return next(clonedReq);
            }),
            catchError((refreshError) => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
              return throwError(() => refreshError);
            })
          );
        }
      }

      return throwError(() => error);
    })
  );
}

export function getAccessToken(): string | null {
  return localStorage.getItem('accessToken') ?? null;
}
