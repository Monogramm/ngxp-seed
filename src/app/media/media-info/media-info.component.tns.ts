import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';

import { TranslateService } from '@ngx-translate/core';

import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Logger } from '../../shared';
import { Media, MediaDTO, MediaService } from '../../data';

import { MediaDetailsComponent } from './media-details';

@Component({
  selector: 'app-tns-media-info',
  templateUrl: './media-info.component.html',
  styleUrls: ['./media-info.component.scss']
})
export class MediaInfoComponent implements OnInit {
  media: Media;

  constructor(public store: MediaService,
    private _translate: TranslateService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location) { }

  ngOnInit() {
    this._route.params.pipe(
      switchMap((params: Params) => this.store.get(params['id'])))
      .subscribe((data: HttpResponse<MediaDTO>) => {
        this.media = this.store.newModel(data.body);
      },
        (error) => {
          if (Logger.isEnabled) {
            Logger.dir(error);
          }
          this._location.back();
        });
  }

  delete(media: Media) {
    if (confirm('Confirm deletion of media "' + media.name + '" ?')) {
      media.deleting = true;

      this.store.delete(media)
        .then(
          () => {
            if (Logger.isEnabled) {
              Logger.log('Deletion successful');
            }
          },
          (error) => {
            if (Logger.isEnabled) {
              Logger.dir(error);
            }
            alert('An error occurred while deleting a media.');
          }
        );
    }
  }

  submit(media: Media) {
    if (media.id === null) {
      this.store.add(media)
        .then(
          () => { this._location.back(); },
          (error) => {
            if (Logger.isEnabled) {
              Logger.dir(error);
            }
            alert('An error occurred while adding an media.');
          }
        );
    } else {
      this.store.update(media)
        .then(
          () => { this._location.back(); },
          (error) => {
            if (Logger.isEnabled) {
              Logger.dir(error);
            }
            alert('An error occurred while updating a media.');
          }
        );
    }
  }

  cancel() {
    this._location.back();
  }

}
