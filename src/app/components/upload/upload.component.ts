import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ToastService } from "../../services/toast.service";
import { AuthService } from "../../services/auth.service";
import { ProfileService } from "../../services/profile.service";
import { PicturesService } from "../../services/pictures.service";
import { Router } from "@angular/router";
import { StaticDataService } from "../../services/static-data.service";
import { AuthHelperService } from "../../utilities/auth-helper.service";
import { MaterializeDirective } from 'angular2-materialize'

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  /*TODO add drag and drop to upload files.*/
  pictureSelected = false
  pictureFile: File
  pictureFileEncoded: string
  dronesSelector: number
  tags: string
  caption: string

  dronesArray = this.staticData.dronesArray;

  constructor(private toastService: ToastService,
              private authHelperService: AuthHelperService,
              private picturesService: PicturesService,
              private router: Router,
              private staticData: StaticDataService) {
  }

  ngOnInit() {
  }

  hidePictureCard() {
    this.pictureSelected = false;
  }

  showPictureCard() {
    this.pictureSelected = true;
  }

  onPictureSelectorChange(ev) {
    this.pictureFile = ev.target.files[0];
    let fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(this.pictureFile)
    fileReader.onloadend = (e) => {
      this.pictureFileEncoded = fileReader.result;
      this.showPictureCard()
    }
  }

  onUploadBtnClick() {
    let uploadFormData: FormData = new FormData()
    if (this.dronesSelector) uploadFormData.append('droneTaken', this.dronesArray[this.dronesSelector])
    if (this.caption) uploadFormData.append('caption', this.caption)
    if (this.tags) {
      let tagsArray = this.tags.split(' ').filter((x) => x !== '' && x.startsWith('#') && x.length > 4).map((x) => x.toLowerCase())
      if (tagsArray.length) tagsArray.forEach((tag) => uploadFormData.append('tags', tag))
    }
    uploadFormData.append('pictureFile', this.pictureFile)

    this.picturesService.uploadPicture(uploadFormData)
      .subscribe((data) => {
        if (data.success) {
          this.toastService.successToast('Picture Uploaded.', this.hidePictureCard.bind(this))
          console.log(data)
        } else {
          this.toastService.errorToast('An error occured.: ' + (data.msg ? data.msg : "Unknown"))
        }
      }, (err) => {
        /*TODO This shit didn't work. Probably something with bug when the server actually returns string.*/
        console.log(err)
        this.toastService.errorToast(err.statusText)
      })
  }

}
