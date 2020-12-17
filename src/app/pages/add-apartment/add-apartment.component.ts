import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Apartment } from '../../models/apartment';
import { PageNavigationData } from '../../models/page-navigation-data';
import { AddApartmentService } from '../../service/add-apartment.service';
import { MatSnackbarService } from '../../service/mat-snackbar.service';
import { CRSImage } from '../../models/listing';
import { WINDOW } from '@ng-toolkit/universal';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-add-apartment',
  templateUrl: './add-apartment.component.html',
  styleUrls: ['./add-apartment.component.css']
})
export class AddApartmentComponent implements OnInit {

  createdApartmentId: string;
  apartment: Apartment;
  breakpoint: number;

  constructor(@Inject(WINDOW) private window: Window, private pageNavigationData: PageNavigationData,
  private addApartmentService: AddApartmentService,
    private matSnackbarService: MatSnackbarService, private router: Router,
   @Inject(PLATFORM_ID) protected platformId: Object) { }

  ngOnInit() {
    this.apartment = this.pageNavigationData.selectedApartment;
    if (isPlatformBrowser(this.platformId)) {
    this.breakpoint = (this.window.innerWidth <= 450) ? 2 : 4;
    }
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 450) ? 2 : 4;
  }

  getLocation() {
    if (isPlatformBrowser(this.platformId)) {
    if (this.window.navigator && this.window.navigator.geolocation) {
      this.window.navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position);
          this.apartment.apartmentLatitude = position.coords.latitude;
          this.apartment.apartmentLongitude = position.coords.longitude;
        },
        error => {
          switch (error.code) {
            case 1:
              console.log('Permission Denied');
              break;
            case 2:
              console.log('Position Unavailable');
              break;
            case 3:
              console.log('Timeout');
              break;
          }
        }
      );
    }
  }
  }

  markerDragEnd(event: any) {
    console.log('event: ', event);
    this.apartment.apartmentLatitude = event.coords.lat;
    this.apartment.apartmentLongitude = event.coords.lng;
  }

  getAmenitiesName(): string[] {
    const keys: string[] = Object.keys(this.apartment.apartmentAmenities);
    return keys;
  }

  addApartment() {
    this.addApartmentService.addApartment(this.apartment).subscribe(
      data => {
        console.log(data);
        if (data != null) {
          this.matSnackbarService.showSnackbar('Apartment Added Successfully', true);
          this.createdApartmentId = data.apartmentId;
        } else {
          this.matSnackbarService.showSnackbar('Failed to add Apartment', false);
        }
      },
      err => {
        console.log(err);
      },
      () => {
        console.log('Request Completed');
      }
    );
  }

  crsImagesUpdateEventHandler($event: CRSImage[]) {
    this.router.navigate(['/home']);
  }

}
