import { HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, of } from 'rxjs';
import { catchError, map, retry, share, timeout } from 'rxjs/operators';
import { REST_CALL_RETRIES } from '../resources/properties';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable()
export class RestClientService {

  constructor(private http: HttpClient, private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  executeGetCall<T>(url: string) {
    console.log('Invoking get call ' + url);
    return this.http.get<T>(url).pipe(
      map(response => this.handleResponse(response)),
      timeout(120000),
      share(),
      retry(REST_CALL_RETRIES),
      catchError(err => this.handleError(err, this.router)));
  }

  executePostCallWithHeader<T>(url: string, request: any, options: any) {
    console.log('Invoking post call ' + url);
    return this.http.post<T>(url, request, options).pipe(map(response => this.handleResponse(response)), timeout(120000),
      share(), retry(REST_CALL_RETRIES), catchError(err => this.handleError(err, this.router)));
  }

  executePostCall<T>(url: string, request: any) {
    console.log('Invoking post call ' + url);
    return this.http.post<T>(url, request, {}).pipe(map(response => this.handleResponse(response)), timeout(120000),
      share(), retry(REST_CALL_RETRIES), catchError(err => this.handleError(err, this.router)));
  }

  executePostRequest(url: string, data: any) {
    console.log('Invoking post request call ' + url);
    const request = new HttpRequest('POST', url, data, {
      reportProgress: true, responseType: 'json'
    });
    return this.http.request(request).pipe(map(response => this.handleResponse(response)), timeout(120000),
      share(), retry(REST_CALL_RETRIES), catchError(err => this.handleError(err, this.router)));
  }

  public handleError(errorResponse: HttpErrorResponse, router: Router) {
    if (isPlatformBrowser(this.platformId)) {
      if (errorResponse.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        console.error('Client side error occurred: ', errorResponse.error.message);
      } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        console.error('Server side error occured: ', errorResponse.statusText);
        console.error('Server side error response: ', errorResponse);
        if (errorResponse.status === 401) {
          // need to redirect to sign-in page and also keep track of where the user came from (which page)
          router.navigate(['/sign-in'], { queryParams: { returnUrl: location.pathname + location.search } });
        }
      }

      // return an observable with a user-facing error message
      return throwError('Something bad happened; please try again later');
    }
    return of();
  }

  private handleResponse(response: any) {
    return response;
  }
}
