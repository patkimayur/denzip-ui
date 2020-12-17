import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of, forkJoin } from 'rxjs';
import { PageNavigationData } from '../models/page-navigation-data';
import { User, UserDisplayInfo } from '../models/user';
import { SECURE_LS } from '../resources/properties';
import { TagService } from '../service/tag.service';
import { AbstractResolver } from './abstract-resolver.service';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class UserDisplayDetailsResolver extends AbstractResolver<PageNavigationData> {

  constructor(private router: Router, private user: UserDisplayInfo,
    private pageNavigationData: PageNavigationData, private tagService: TagService) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageNavigationData | string> {

    console.log('inside resolver');

    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser == null) {
        super.handleError('User not logged in', this.router);
      }

      this.user.userName = currentUser.userName;
      this.user.userEmail = currentUser.userEmail;
      this.user.userMobile = currentUser.userMobile;

      const allTags = this.tagService.getAllTags();
      const userTags = this.tagService.getUserTags(currentUser.userId);

      return forkJoin([allTags, userTags]).pipe(
        map(results => {
          return this.pageNavigationData.setAllTags(results[0]).setUserTags(results[1]);
        }),
        // Do not change this to (this.handleError). Router does not gets instantiated in that case
        catchError(err => super.handleError(err, this.router))
      );
    }



    return of('');
  }
}
