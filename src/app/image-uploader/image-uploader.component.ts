
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import * as uuid from 'uuid';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent implements OnInit {
  @Input() uploadUrl;
  @Input() urls;

  @Input() size = 'sm';
  @Output() afterDelete = new EventEmitter();
  @Output() afterUpload = new EventEmitter();

  file;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  onFileChange(event) {
    const self = this;
    const image = new Image();
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      image.onload = function(imageEvent) {
        const blob = self.getBlob(image, self.size); // type:x, size:y
        const picFile = new File([blob], file.name);
        const ext = file.name.split('.').pop();
        const fname = uuid.v4() + '.' + ext;
        self.postFile(self.uploadUrl, fname, picFile).subscribe(x => {
          console.log('postFile called');
        });
        self.afterUpload.emit({
          name: fname, // x.result.files.file[0].name,
          file: picFile
          // originalFilename: "alashijiaxueyu.jpg"
          // size: 17353
          // type: "image/jpeg"
        });
      };

      reader.onload = (readerEvent: any) => {
        // use for trigger image.onload event
        image.src = readerEvent.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  // ---------------------------------------------------------------------
  // url --- api/files/upload
  // file --- { name:x, size:y, type: z }
  public postFile(url: string, fname: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('fname', fname);
    formData.append('file', file);
    return this.http.post(url, formData);
  }

  onUpload() {

  }

  onDelete() {

  }

  dataURLToBlob(dataURL) {
    const BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) === -1) {
        const parts: string[] = dataURL.split(',');
        const contentType: string = parts[0].split(':')[1];
        const raw = parts[1];

        return new Blob([raw], {type: contentType});
    } else {
      const parts = dataURL.split(BASE64_MARKER);
      const contentType = parts[0].split(':')[1];
      const raw = window.atob(parts[1]);
      const rawLength = raw.length;

      const uInt8Array = new Uint8Array(rawLength);

      for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
      }
      return new Blob([uInt8Array], {type: contentType});
    }
  }

  // scale image inside frame
  resizeImage(frame_w: number, frame_h: number, w: number, h: number) {
    // let rw = 0;
    // let rh = 0;

    // if (h * frame_w / w > frame_h) {
    //   rw = frame_w;
    //   rh = Math.round(h * frame_w / w);
    // } else {
    //   rh = frame_h;
    //   rw = Math.round(w * frame_h / h);
    // }
    return { 'w': Math.round(frame_w), 'h': Math.round(frame_h), 'padding_top': 0 }; // Math.round((frame_h - rh) / 2) };
  }

  getBlob(image, size = 'sm') {
    const canvas = document.createElement('canvas');
    if (size === 'sm') {
      const d = this.resizeImage(320, 240, image.width, image.height);
      canvas.width = d.w;
      canvas.height = d.h;
    } else if (size === 'lg') {
      const d = this.resizeImage(400, 300, image.width, image.height);
      canvas.width = d.w;
      canvas.height = d.h;
    } else {
      const d = this.resizeImage(320, 240, image.width, image.height);
      canvas.width = image.width;
      canvas.height = image.height;
    }
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    return this.dataURLToBlob(dataUrl);
  }
}
