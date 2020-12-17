import { formatDate } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CRSImage, Listing } from '../../models/listing';

@Component({
  selector: 'app-ng-carousel',
  templateUrl: './carousel-ng.component.html',
  styleUrls: ['./carousel-ng.component.css'],
})
export class CarouselNgComponent implements OnInit {

  carouselIndex = 0;
  images: CRSImage[];
  bannerImage: string;
  bannerImageSrcSet: string;
  additionalImageCount: number;
  brokerListing: boolean;
  createdDateValue: string;
  imagesExist = true;
  @Input() listing: Listing;
  @Input() cardLayout: boolean;
  @ViewChild('carousel') carousel;

  constructor(private dialog: MatDialog, @Inject(LOCALE_ID) private locale: string) {
  }

  ngOnInit() {
    this.images = this.listing.crsImages;
    if (this.images != null && this.images.length > 0) {
      this.images = this.sortImages();
      this.bannerImage = this.images[0].defaultImage;
      this.bannerImageSrcSet = this.images[0].imageSet;
      this.additionalImageCount = this.images.length - 1;
      const createdDate = new Date(this.listing.createdTime);
      this.createdDateValue = formatDate(createdDate, 'MMM d', this.locale);
      this.brokerListing = this.listing.createdUserAuthorityNames.findIndex(name =>
        name.includes('ROLE_BROKER')) === -1 ? false : true;
    }
  }

  private sortImages() {

    return this.images.sort((firstValue, secondValue) =>
      this.sort(firstValue.imageName, secondValue.imageName)
    );
  }

  private sort(firstValue: string, secondValue: string) {
    return firstValue.toLowerCase() < secondValue.toLowerCase() ? -1 : 1;
  }

  onImageError(event: any) {
    console.log(event);
    event.target.onerror = null;
    event.target.src = 'assets/denzip-logo-dark-320_240.png';
    event.target.srcset = '';
    this.additionalImageCount = 0;
    this.imagesExist = false;
  }

  openDialog(): void {
    if (this.imagesExist) {
      const dialogRef = this.dialog.open(CarouselDialogComponent, {
        width: '100%',
        height: 'auto',
        maxWidth: '100vw',
        maxHeight: '100vh',
        autoFocus: false,
        data: this.listing
      });
    }
  }


}

@Component({
  selector: 'app-ng-carousel-dialog',
  templateUrl: './carousel-ng-dialog.component.html',
  styleUrls: ['./carousel-ng.component.css']
})
export class CarouselDialogComponent implements OnInit {

  carouselIndex = 0;
  images: CRSImage[];
  @ViewChild('carousel') carousel;
  listing: Listing;
  private swipeCoord?: [number, number];
  private swipeTime?: number;

  constructor(
    public dialogRef: MatDialogRef<CarouselNgComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.listing = this.data;
    this.images = this.listing.crsImages;
  }

  onNoClick(): void {
    this.dialogRef.close();
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
        direction[0] < 0 ? this.carousel.next() : this.carousel.prev();


      }
    }
  }

}

