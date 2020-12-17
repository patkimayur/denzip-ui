import { Component, OnInit, Input, OnChanges, SimpleChange, Inject, PLATFORM_ID } from '@angular/core';
import { LocationData } from '../../models/location-data';
import { PropertyDetailService } from '../../service/property-detail.service';
import { LocalityData } from '../../models/locality';
import { SECURE_LS } from '../../resources/properties';
import { User } from '../../models/user';
import { MatDialog } from '@angular/material';
import { SignInComponent } from '../../pages/sign-in/sign-in.component';
import { AbstractReloadableComponent } from '../reloadable-component/abstract-reloadable-component';
import { Router } from '@angular/router';
import { WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-location-map',
  templateUrl: './location-map.component.html',
  styleUrls: ['./location-map.component.css'],
})
export class LocationMapComponent extends AbstractReloadableComponent implements OnInit, OnChanges {

  @Input() selectedLocalityCategoryIndex: number;

  locationData: LocationData;
  localityData: LocalityData;
  infoWindowOpened = null;
  previousInfoWindow = null;
  isUserLoggedIn: boolean;
  constructor(@Inject(WINDOW) private window: Window, protected router: Router,
    private propertyDetailService: PropertyDetailService,
    private dialog: MatDialog, @Inject(PLATFORM_ID) private platformId: Object) {
    super(router);
  }

  ngOnInit() {
    this.initialize();
  }

  initialize() {
    this.locationData = this.propertyDetailService.getLocationData();
    this.localityData = this.propertyDetailService.getLocalityData();

    if (SECURE_LS && SECURE_LS.get('currentUser')) {
      const securedCurrentUser = SECURE_LS.AES.decrypt(SECURE_LS.get('currentUser').toString(), 'crsSecureLs');
      const securedCurrentUserStr = securedCurrentUser.toString(SECURE_LS.enc._Utf8);
      const currentUser: User = JSON.parse(securedCurrentUserStr);
      if (currentUser) {
        this.isUserLoggedIn = true;
      }
    }

    console.log('isUserLoggedIn: ', this.isUserLoggedIn);
  }

  login() {
    const dialogRef = this.dialog.open(SignInComponent, {
      width: '400px',
      disableClose: true,
      data: { returnUrl: location.pathname + location.search },
      autoFocus: false
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.closeWindow();
    this.infoWindowOpened = null;
    this.previousInfoWindow = null;
  }

  closeWindow() {
    if (this.previousInfoWindow != null) {
      this.previousInfoWindow.close();
    }
  }

  selectMarker(infoWindow) {
    console.log('selectMarker: ', infoWindow);
    if (this.previousInfoWindow == null) {
      this.previousInfoWindow = infoWindow;
    } else {
      this.infoWindowOpened = infoWindow;
      this.previousInfoWindow.close();
    }
    this.previousInfoWindow = infoWindow;
  }

  mapReady(event: any) {
    const map = event;
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('MapButton'));
  }

  openMap() {
    if (isPlatformBrowser(this.platformId)) {
      const latlng = this.locationData.latitude + ',' + this.locationData.longitude;
      if /* if we're on iOS, open in Apple Maps */
      ((navigator.platform.indexOf('iPhone') !== -1) ||
      (navigator.platform.indexOf('iPad') !== -1) ||
        (navigator.platform.indexOf('iPod') !== -1)) {
        this.window.open(encodeURI('maps://maps.google.com/maps/search/?api=1&query=' + latlng));
      } else { /* else use Google */
        this.window.open(encodeURI('https://www.google.com/maps/search/?api=1&query=' + latlng));
      }
    }
  }


}
