import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CRSImage } from '../models/listing';
import { SERVER_BASE_PATH } from '../resources/properties';
import { RestClientService } from './rest-client.service';


@Injectable()
export class FileUploadService {

  private LISTING_IMAGE_PATH = 'uploadListingImage';
  private APARTMENT_IMAGE_PATH = 'uploadApartmentImage';


  constructor(private restClientService: RestClientService) { }

  public uploadFile(entityId: string, entityType: string, fileList: File[]): Observable<HttpEvent<CRSImage[]>> {
    const formdata: FormData = new FormData();
    for (let i = 0; i < fileList.length; i++) {
      formdata.append('imageFile', fileList[i]);
    }
    if (entityType === 'listing') {
      formdata.append('listingId', entityId);
      return this.restClientService.executePostRequest(SERVER_BASE_PATH + this.LISTING_IMAGE_PATH, formdata);
    } else if (entityType === 'apartment') {
      formdata.append('apartmentId', entityId);
      return this.restClientService.executePostRequest(SERVER_BASE_PATH + this.APARTMENT_IMAGE_PATH, formdata);
    }
  }

}
