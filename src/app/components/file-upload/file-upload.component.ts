import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, NgZone, OnChanges, Output, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { Observable } from 'rxjs';
import { CRSImage } from '../../models/listing';
import { FileUploadService } from '../../service/file-upload.service';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnChanges {

  selectedFiles: FileList;
  progress: { percentage: number } = { percentage: 0 };
  imageSrc: string;
  images: CRSImage[];
  compressedFiles: File[] = [];

  @Input() entityId: string;
  @Input() entityType: string;
  @Output() crsImagesUpdateEvent = new EventEmitter<CRSImage[]>();

  constructor(private fileUploadService: FileUploadService, private ng2ImgMaxService: Ng2ImgMaxService,
    private router: Router, private zone: NgZone) { }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    const change = changes['entityId'];
    const entityId: string = change.currentValue;
    if (entityId != null) {
      this.upload(entityId);
    }
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }

  upload(entityId: string) {
    if (this.selectedFiles != null) {
      this.progress.percentage = 0;

      for (let i = 0; i < this.selectedFiles.length; i++) {
        const fileToCmp: File = this.selectedFiles.item(i);
        // Compress files only if they are larger than 750 KB
        if (fileToCmp.size > 750000) {
          console.log('Compressing file: ', fileToCmp);
          const imgCmpObv: Observable<any> = this.ng2ImgMaxService.resizeImage(fileToCmp, 1280, 10000, true);
          imgCmpObv.subscribe(cmpImg => {
            const cmpFile = new File([cmpImg], String(fileToCmp.lastModified) + '.jpeg');
            this.compressedFiles.push(cmpFile);
            console.log('total length of compressedFiles:', this.compressedFiles.length);
            this.uploadFiles(entityId);
          },
            err => {
              console.log(err);
              // if for any reason compression fails, add original image to compressedFile and go ahead
              this.compressedFiles.push(new File([fileToCmp], String(fileToCmp.lastModified) + '.jpeg'));
              this.uploadFiles(entityId);
            },
            () => console.log('Request completed')
          );
        } else {
          console.log('Skipping compression for file: ', fileToCmp);
          this.compressedFiles.push(new File([fileToCmp], String(fileToCmp.lastModified) + '.jpeg'));
          this.uploadFiles(entityId);
        }
      }

    } else {
      this.crsImagesUpdateEvent.emit(null);
    }
  }

  private uploadFiles(entityId: string) {
    if (this.compressedFiles.length === this.selectedFiles.length) {
      this.fileUploadService.uploadFile(entityId, this.entityType, this.compressedFiles).subscribe(
        event => {
          console.log(event);
          if (event.type === HttpEventType.UploadProgress) {
            this.progress.percentage = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            console.log('Files are completely uploaded!');
            this.images = event.body;
            console.log('crsImages: ', this.images.length);
            this.crsImagesUpdateEvent.emit(this.images);
          }
        },
        err => console.log(err),
        () => console.log('Request completed')
      );
    }
  }

}
