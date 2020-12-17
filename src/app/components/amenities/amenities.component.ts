import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PropertyDetailService } from '../../service/property-detail.service';

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AmenitiesComponent implements OnInit {

  amenitiesList: string[];
  constructor(private propertyDetailService: PropertyDetailService) { }

  ngOnInit() {
    this.amenitiesList = this.propertyDetailService.getAmenitiesList();
    console.log('AmenitiesList: ', this.amenitiesList);
  }

}
