import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PropertyDetailService } from '../../service/property-detail.service';


@Component({
  selector: 'app-locality',
  templateUrl: './locality.component.html',
  styleUrls: ['./locality.component.css'],
})
export class LocalityComponent implements OnInit {
  localityData: any;
  private swipeCoord?: [number, number];
  private swipeTime?: number;
  selected = 0;

  @Output() selectedCategoryIndexUpdate = new EventEmitter<number>();

  constructor(private propertyDetailService: PropertyDetailService) { }

  ngOnInit() {
    this.localityData = this.propertyDetailService.getLocalityData();
  }

  swipe(e: TouchEvent, when: string): void {
    const coord: [number, number] = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
    const time = new Date().getTime();

    if (when === 'start') {
      this.swipeCoord = coord;
      this.swipeTime = time;
    } else if (when === 'end') {
      const direction = [coord[0] - this.swipeCoord[0], coord[1] - this.swipeCoord[1]];
      const duration = time - this.swipeTime;

      if (duration < 1000 //
        && Math.abs(direction[0]) > 30 // Long enough
        && Math.abs(direction[0]) > Math.abs(direction[1] * 3)) { // Horizontal enough
        direction[0] < 0 ? this.selected++ : this.selected--;


      }
    }
  }

  selectedCategoryIndexChanged($event: any) {
    console.log('new tab index:', $event);
    this.selectedCategoryIndexUpdate.emit($event);
  }


}
