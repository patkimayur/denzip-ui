import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable, Optional, Inject, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { PageNavigationData } from '../models/page-navigation-data';
import { User } from '../models/user';
import { SECURE_LS } from '../resources/properties';
import { RESPONSE, REQUEST } from '@nguniversal/express-engine/tokens';
import { isPlatformServer } from '@angular/common';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private http: HttpClient,
    private tokenExtractor: HttpXsrfTokenExtractor,
    private pageNavigationData: PageNavigationData,
    @Optional() @Inject(REQUEST) private req: Request, @Inject(PLATFORM_ID) private platformId: Object) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const headerName = 'XSRF-TOKEN';
    const respHeaderName = 'X-XSRF-TOKEN';
    const authzHeaderName = 'Authorization';
    const token = this.tokenExtractor.getToken() as string;

    if (token !== null && !request.headers.has(headerName)) {
      request = request.clone({ headers: request.headers.append(respHeaderName, token) });
    }
    if (isPlatformServer(this.platformId)) {
      if (this.req && this.req.headers && this.req.headers['cookie'] && request.method === 'POST') {
        const tokenName = 'XSRF-TOKEN=';
        const tokenSubString = this.req.headers['cookie'].slice(this.req.headers['cookie'].indexOf(tokenName) + tokenName.length);
        const tokenValue = tokenSubString.substring(0, tokenSubString.indexOf(';'));
        request = request.clone({
          headers: request.headers
            .append('cookie', this.req.headers['cookie'])
            .append('X-XSRF-TOKEN', tokenValue)
        });
      }
    }

    request = request.clone({ withCredentials: true });

    // add authorization header with token if available
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser && currentUser.oAuthObj && currentUser.oAuthObj.access_token && !request.headers.has(authzHeaderName)) {
        request = request.clone({
          headers: request.headers.append('Authorization', 'Bearer ' + currentUser.oAuthObj.access_token),
          withCredentials: true
        });
      }
    }

    // console.log('the request sent is ', request);
    return next.handle(request);

  }
}
