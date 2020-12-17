import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Apartment } from '../models/apartment';
import { PageNavigationData } from '../models/page-navigation-data';
import { AddApartmentService } from '../service/add-apartment.service';
import { AbstractResolver } from './abstract-resolver.service';

@Injectable()
export class AddApartmentResolver extends AbstractResolver<PageNavigationData>  {

  constructor(private router: Router, private pageNavigationData: PageNavigationData,
    private addApartmentService: AddApartmentService) {
    super();
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageNavigationData | string> {
    console.log('PageNavigationData: ', this.pageNavigationData);
    const apartment = new Apartment();
    this.pageNavigationData.setSelectedApartment(apartment);
    return this.addApartmentService.getDefaultApartmentAmenities()
      .pipe(
        map(amenities => {
          return this.pageNavigationData.selectedApartment.apartmentAmenities = amenities;
        },
          // Do not change this to (this.handleError). Router does not gets instantiated in that case
          catchError(err => super.handleError(err, this.router))
        ));
  }
}
