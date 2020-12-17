import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  displayIcon: boolean;
  isMobile: boolean;

  constructor(@Inject(WINDOW) private window: Window, private deviceService: DeviceDetectorService
  , @Inject(PLATFORM_ID) private platformId: Object) {
    this.detectDevice();
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    this.displayIcon = (this.window.screen.width >= 470) ? true : false;
    }
  }

  detectDevice() {
    const deviceInfo = this.deviceService.getDeviceInfo();
    console.log('Device Info: ', deviceInfo);
    this.isMobile = this.deviceService.isMobile();
    console.log(this.isMobile);  // returns if the device is a mobile device (android / iPhone / windows-phone etc)
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
    this.displayIcon = (this.window.screen.width >= 470) ? true : false;
    }
  }

}
