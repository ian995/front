import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';

import { Router } from "@angular/router";

import { Client } from '../../../../../services/api';
import { Session } from '../../../../../services/session';
import { AttachmentService } from '../../../../../services/attachment';
import { OverlayModalService } from '../../../../../services/ux/overlay-modal';
import { MediaModalComponent } from '../../../../media/modal/modal.component';
import { FeaturesService } from '../../../../../services/features.service';
import isMobile from '../../../../../helpers/is-mobile';

@Component({
  moduleId: module.id,
  selector: 'minds-remind',
  inputs: ['object', '_events: events'],
  templateUrl: '../activity/activity.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class Remind {

  minds = window.Minds;

  activity: any;
  @Input() boosted: boolean = false;
  hideTabs: boolean;

  events: EventEmitter<any>;
  eventsSubscription: any;

  editing: boolean = false;
  commentsToggle: boolean = false;
  showBoostOptions: boolean = false;
  translateToggle: any;
  translateEvent: EventEmitter<any> = new EventEmitter();
  childEventsEmitter: EventEmitter<any> = new EventEmitter();
  isTranslatable: boolean = false;
  menuOptions: any = [];
  canDelete: boolean = false;
  videoDimensions: Array<any> = null;

  @Output('matureVisibilityChange') onMatureVisibilityChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('batchImage', { static: false }) batchImage: ElementRef;

  constructor(
    public session: Session,
    public client: Client,
    public attachment: AttachmentService,
    private changeDetectorRef: ChangeDetectorRef,
    private overlayModal: OverlayModalService,
    private router: Router,
    protected featuresService: FeaturesService,
  ) {
    this.hideTabs = true;
  }

  set _events(value: any) {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }

    this.events = value;

    this.eventsSubscription = this.events.subscribe(({ action, args = [] }) => {
      switch (action) {
        case 'translate':
          this.translate.apply(this, args);
          break;
      }

      this.changeDetectorRef.markForCheck();
    });
  }

  set object(value: any) {
    this.activity = value;
    this.activity.boosted = this.boosted;

    if (
      this.activity.custom_type == 'batch'
      && this.activity.custom_data
      && this.activity.custom_data[0].src
    ) {
      this.activity.custom_data[0].src = this.activity.custom_data[0].src.replace(this.minds.site_url, this.minds.cdn_url);
    }
  }

  getOwnerIconTime() {
    let session = this.session.getLoggedInUser();
    if(session && session.guid === this.activity.ownerObj.guid) {
      return session.icontime;
    } else {
      return this.activity.ownerObj.icontime;
    }
  }

  isUnlisted(entity: any) {
    return entity && (entity.access_id === '0' || entity.access_id === 0);
  }

  ngOnDestroy() {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  toDate(timestamp) {
    return new Date(timestamp * 1000);
  }

  translate($event: any) {
    this.translateEvent.emit($event);
  }

  propagateTranslation(e?) {
    return;
  }

  save() { /* NOOP */ }

  isPending(activity) {
    return activity && activity.pending && activity.pending !== '0';
  }

  openComments() { /* NOOP */ }

  showBoost() { /* NOOP */ }

  showWire() { /* NOOP */ }

  togglePin() { /* NOOP */ }

  menuOptionSelected(e) { /* NOOP */ }

  toggleMatureVisibility() {
    this.activity.mature_visibility = !this.activity.mature_visibility;

    this.onMatureVisibilityChange.emit();
  }

  setVideoDimensions($event) {
    this.videoDimensions = $event.dimensions;
  }

  setImageDimensions() {
    const img: HTMLImageElement = this.batchImage.nativeElement;
    this.activity.custom_data[0].width = img.naturalWidth;
    this.activity.custom_data[0].height = img.naturalHeight;
  }

  showMediaModal() {
    if (this.featuresService.has('media-modal')) {
      // Mobile (not tablet) users go to media page instead of modal
      if (isMobile() && Math.min(screen.width, screen.height) < 768) {
        this.router.navigate([`/media/${this.activity.entity_guid}`]);
      }

      if (this.activity.custom_type === 'video') {
        this.activity.custom_data.dimensions = this.videoDimensions;
      } else { // Image
        // Set image dimensions if they're not already there
        if (this.activity.custom_data[0].width === '0' || this.activity.custom_data[0].height === '0') {
          this.setImageDimensions();
        }
      }

      this.activity.modal_source_url = this.router.url;

      this.overlayModal.create(MediaModalComponent, this.activity, {
        class: 'm-overlayModal--media'
      }).present();
    } else {
      this.router.navigate([`/media/${this.activity.entity_guid}`]);
    }
  }
}
