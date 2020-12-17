import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { User } from './models/user';
import { SECURE_LS, initialiseSecureLS } from './resources/properties';
import { ListingSummaryService } from './service/listing-summary.service';
import { ListingUserRelationService } from './service/listing-user-relation.service';
import { MetaService } from './service/meta.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import SecureLS from 'secure-ls';
import { PLATFORM_ID } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private listingUserRelationService: ListingUserRelationService,
    private listingSummaryService: ListingSummaryService, private router: Router,
    private activatedRoute: ActivatedRoute, private metaService: MetaService,
    @Inject(PLATFORM_ID) private platformId: Object) {



    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        of(event).pipe(
          map(() => this.activatedRoute),
          map((route) => {
            while (route.firstChild) {
              route = route.firstChild;
            }
            return route;
          }),
          filter((route) => route.outlet === 'primary'),
          mergeMap((route) => route.data)
        ).subscribe((data) => {
          if (data['title'] && data['title'] != null) {
            this.metaService.updateTitle(data['title']);
          }
          if (data['description'] && data['description'] != null) {
            this.metaService.updateDescription(data['description']);
          }
        });

        if (isPlatformBrowser(this.platformId)) {
            initialiseSecureLS();
          (<any>window).ga('set', 'page', event.urlAfterRedirects);
          (<any>window).ga('set', 'title', this.metaService.getTitle());
          (<any>window).ga('send', 'pageview');
        }

      }
    });

  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser.userId) {
        this.listingUserRelationService.getShortlistedListings(currentUser.userId)
          .subscribe(
            data => this.listingSummaryService.cartBadgeEvent(data),
            err => console.log(err),
            () => console.log('Request Completed')
          );

        this.listingUserRelationService.getProspectiveListings(currentUser.userId)
          .subscribe(
            data => this.listingSummaryService.cartBadgeEventForPL(data),
            err => console.log(err),
            () => console.log('Request Completed')
          );
      }
    }
  }
}
}
