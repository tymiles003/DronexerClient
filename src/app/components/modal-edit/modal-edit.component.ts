import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PostComponent } from "../post/post.component";
import { StaticDataService } from "../../services/static-data.service";

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.css']
})

export class ModalEditComponent implements OnInit {

  @Input() editModal;
  @Input() post;
  @Output() editConfirmed = new EventEmitter<any>();
  @Output() editCancelled = new EventEmitter<boolean>();

  editedData: any;
  dronesArray = this.staticData.dronesArray;

  constructor(private staticData: StaticDataService) {
  }

  cancelEdit() {
    this.editCancelled.emit(true);
  }

  confirmEdit() {
    this.editConfirmed.emit(this.editedData);
  }

  ngOnInit() {
    this.editedData = {};
    this.editedData.newTags = this.post.tags.map((tag) => '#' + tag).join(' ') || '';
    this.editedData.newCaption = this.post.caption;
    this.editedData.newDroneTaken = this.staticData.getDronesArray().indexOf(this.post.droneTaken);
  }

}
