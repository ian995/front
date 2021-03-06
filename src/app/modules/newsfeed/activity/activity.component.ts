import {
  Component,
  Input,
  HostBinding,
  ElementRef,
  HostListener,
  Optional,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  SkipSelf,
  Injector,
} from '@angular/core';
import { ActivityService as ActivityServiceCommentsLegacySupport } from '../../../common/services/activity.service';

import {
  ActivityService,
  ACTIVITY_FIXED_HEIGHT_RATIO,
  ActivityEntity,
} from './activity.service';
import { Subscription, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { ComposerService } from '../../composer/services/composer.service';
import { ClientMetaService } from '../../../common/services/client-meta.service';
import { ElementVisibilityService } from '../../../common/services/element-visibility.service';
import { NewsfeedService } from '../services/newsfeed.service';
import { map } from 'rxjs/operators';
import { TranslationService } from '../../../services/translation';

@Component({
  selector: 'm-activity',
  templateUrl: 'activity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ActivityService,
    ActivityServiceCommentsLegacySupport, // Comments service should never have been called this.
    ComposerService,
    ClientMetaService,
    ElementVisibilityService, // MH: There is too much analytics logic in this entity component. Refactor at a later date.
  ],
  host: {
    class: 'm-border',
  },
})
export class ActivityComponent implements OnInit, AfterViewInit, OnDestroy {
  entity$: Observable<ActivityEntity> = this.service.entity$;

  @Input('canDelete') set _canDelete(value: boolean) {
    this.service.canDeleteOverride$.next(value);
  }

  @Input() set entity(entity) {
    this.service.setEntity(entity);
    this.isBoost = entity.boosted;
  }

  @Input() set displayOptions(options) {
    this.service.setDisplayOptions(options);
  }

  @Input() slot: number = -1;

  /**
   * Whether or not we allow autoplay on scroll
   */
  @Input() allowAutoplayOnScroll: boolean = false;

  /**
   * Whether or not autoplay is allowed (this is used for single entity view, media modal and media view)
   */
  @Input() autoplayVideo: boolean = false;

  @Input() canRecordAnalytics: boolean = true;

  @Output() deleted: EventEmitter<any> = new EventEmitter<any>();

  @HostBinding('class.m-activity--boost')
  isBoost = false;

  @HostBinding('class.m-activity--fixedHeight')
  isFixedHeight: boolean;

  @HostBinding('class.m-activity--fixedHeightContainer')
  isFixedHeightContainer: boolean;

  @HostBinding('class.m-activity--noOwnerBlock')
  noOwnerBlock: boolean;

  @HostBinding('style.height')
  heightPx: string;

  heightSubscription: Subscription;

  constructor(
    public service: ActivityService,
    private el: ElementRef,
    private cd: ChangeDetectorRef,
    @SkipSelf() private injector: Injector,
    private clientMetaService: ClientMetaService,
    private elementVisibilityService: ElementVisibilityService,
    private newsfeedService: NewsfeedService,
    private translationService: TranslationService
  ) {}

  ngOnInit() {
    this.isFixedHeight = this.service.displayOptions.fixedHeight;
    this.isFixedHeightContainer = this.service.displayOptions.fixedHeightContainer;
    this.noOwnerBlock = !this.service.displayOptions.showOwnerBlock;
    this.heightSubscription = this.service.height$.subscribe(
      (height: number) => {
        if (!this.service.displayOptions.fixedHeight) return;
        if (this.service.displayOptions.fixedHeightContainer) return;
        this.heightPx = `${height}px`;
        this.cd.markForCheck();
        this.cd.detectChanges();
      }
    );
  }

  ngOnDestroy() {
    this.heightSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => this.calculateHeight());
    if (this.canRecordAnalytics) {
      this.elementVisibilityService
        .setEntity(this.service.entity$.value)
        .setElementRef(this.el)
        .onView((entity: ActivityEntity) => {
          this.newsfeedService.recordView(
            entity,
            true,
            null,
            this.clientMetaService.inherit(this.injector).build({
              campaign: entity.boosted_guid ? entity.urn : '',
              position: this.slot,
            })
          );
        });
      this.elementVisibilityService.checkVisibility();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.calculateHeight();
  }

  calculateHeight(): void {
    if (!this.service.displayOptions.fixedHeight) return;
    if (this.service.displayOptions.fixedHeightContainer) return;
    const height =
      this.el.nativeElement.clientWidth / ACTIVITY_FIXED_HEIGHT_RATIO;
    this.service.height$.next(height);
  }

  delete() {
    this.deleted.emit(this.service.entity$.value);
  }

  translate() {
    console.log('translate selected');
    // this.showTranslation
  }
}
