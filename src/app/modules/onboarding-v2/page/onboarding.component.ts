import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Session } from '../../../services/session';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { Storage } from '../../../services/storage';
import { OnboardingV2Service } from '../service/onboarding.service';
import { SidebarMarkersService } from '../../../common/layout/sidebar/markers.service';
import { iOSVersion } from '../../../helpers/is-safari';
import { TopbarService } from '../../../common/layout/topbar.service';
import { SidebarNavigationService } from '../../../common/layout/sidebar/navigation.service';
import { FeaturesService } from '../../../services/features.service';
import { Subscription } from 'rxjs';
import { PageLayoutService } from '../../../common/layout/page-layout.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'm-onboarding',
  templateUrl: 'onboarding.component.html',
})
export class OnboardingComponent implements OnInit, OnDestroy {
  showTitle: boolean = false;
  shown: boolean = false;

  @HostBinding('class.m-onboarding__iosFallback')
  iosFallback: boolean = false;

  @HostBinding('class.m-onboarding--newNavigation')
  newNavigation: boolean = false;

  loadingSubscription: Subscription;
  slideChangedSubscription: Subscription;
  closeSubscription: Subscription;
  routerSubscription: Subscription;

  constructor(
    private session: Session,
    private router: Router,
    private storage: Storage,
    private route: ActivatedRoute,
    private onboardingService: OnboardingV2Service,
    private topbarService: TopbarService,
    private navigationService: SidebarNavigationService,
    private sidebarMarkersService: SidebarMarkersService,
    private featuresService: FeaturesService,
    private pageLayoutService: PageLayoutService
  ) {
    this.newNavigation = this.featuresService.has('navigation');
    this.routerSubscription = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(data => {
        this.topbarService.toggleVisibility(false);

        if (this.newNavigation) {
          this.navigationService.setVisible(false);
          this.pageLayoutService.useFullWidth();
        } else {
          this.sidebarMarkersService.toggleVisibility(false);
        }
      });
  }

  async ngOnInit() {
    if (!this.session.isLoggedIn()) {
      this.router.navigate(['/register']);
      return;
    }

    this.iosFallback = iOSVersion() !== null;

    if (!this.onboardingService.loaded) {
      await this.onboardingService.checkProgress();
    }

    this.slideChangedSubscription = this.onboardingService.slideChanged.subscribe(
      currentSlide => {
        this.router.navigate([
          this.onboardingService.steps[currentSlide].route,
        ]);
      }
    );

    this.closeSubscription = this.onboardingService.close.subscribe(() => {
      if (this.featuresService.has('navigation')) {
        this.router.navigate(['/newsfeed']);
      } else {
        this.router.navigate(['/newsfeed/global/top']);
      }
    });

    this.route.url.subscribe(() => {
      const section: string = this.route.snapshot.firstChild.routeConfig.path;
      if (section === 'notice') {
        this.showTitle = false;
      } else {
        if (!this.shown) {
          this.shown = true;
          this.onboardingService.shown();
        }
        this.showTitle = true;

        for (const item of this.onboardingService.steps) {
          item.selected = item.name.toLowerCase() === section;
        }
        this.onboardingService.steps = this.onboardingService.steps.slice(0);
      }
    });
  }

  ngOnDestroy() {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    if (this.slideChangedSubscription) {
      this.slideChangedSubscription.unsubscribe();
    }
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    this.topbarService.toggleVisibility(true);

    if (this.newNavigation) {
      this.navigationService.setVisible(true);
    } else {
      this.sidebarMarkersService.toggleVisibility(true);
    }
  }
}
