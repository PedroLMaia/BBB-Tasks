// import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, empty, throwError } from 'rxjs';
// import { catchError, switchMap, tap } from 'rxjs/operators';

// import { AuthService } from './auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class WebReqInterceptor implements HttpInterceptor{

//   constructor(private authService: AuthService) { }

//   refreshingAccessToken: boolean | undefined;

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
//     request = this.addAuthHeader(request);
  
//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         // console.log(error);

//         if(error.status === 401 && !this.refreshingAccessToken){
//           //401, não autorizado

//           //refresh accessToken
//             return this.refreshAccessToken()
//             .pipe(
//               switchMap(() => {
//                 request = this.addAuthHeader(request);
//                 return next.handle(request);
//               }),
//               catchError((err: any) => {
//                 console.log(err);
//                 this.authService.logout();
//                 return empty();
//               })
//             )
          
//           // console.log("test!")
//           // this.authService.logout();
//         }
//         return throwError(() => error);
//       })
//     )
//   }

//   refreshAccessToken(){
//     this.refreshingAccessToken = true;
//     //Queremos chamar um metodo no auth service para mandar uma request de refresh para access token.
//     return this.authService.getNewAccessToken().pipe(
//       tap(() => {
//         this.refreshingAccessToken = false;
//         console.log("Access token refreshed!!");
//       })
//     )
//   }


//   addAuthHeader(request: HttpRequest<any>){
//     const token = this.authService.getAccessToken();

//     if(token){
//       return request.clone({
//         setHeaders: {
//           'x-access-token': token
//         }
//       })
//     }
//     return request;
//   }
// }


import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, empty, throwError, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebReqInterceptor implements HttpInterceptor{

  constructor(private authService: AuthService) { }

  refreshingAccessToken: boolean | undefined;

  accessTokenRefresed: Subject<any> = new Subject();

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    request = this.addAuthHeader(request);
  
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // console.log(error);

        if(error.status === 401){
          //401, não autorizado

          //refresh accessToken
            return this.refreshAccessToken()
            .pipe(
              switchMap(() => {
                request = this.addAuthHeader(request);
                return next.handle(request);
              }),
              catchError((err: any) => {
                console.log(err);
                this.authService.logout();
                return empty();
              })
            )
          
          // console.log("test!")
          // this.authService.logout();
        }
        return throwError(() => error);
      })
    )
  }

  refreshAccessToken(){
    if(this.refreshingAccessToken){
      return new Observable(observer => {
        this.accessTokenRefresed.subscribe(() => {
          observer.next();
          observer.complete();
        })
      })
    }else{
      this.refreshingAccessToken = true;
    //Queremos chamar um metodo no auth service para mandar uma request de refresh para access token.
    return this.authService.getNewAccessToken().pipe(
      tap(() => {
        console.log("Access token refreshed!!");
        this.refreshingAccessToken = false;
        this.accessTokenRefresed.next();
      })
    )
    }
  }


  addAuthHeader(request: HttpRequest<any>){
    const token = this.authService.getAccessToken();

    if(token){
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }
    return request;
  }
}