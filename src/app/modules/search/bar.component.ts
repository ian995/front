import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Router,
  NavigationEnd,
  ActivatedRoute,
  ParamMap,
  ActivationEnd,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { ContextService } from '../../services/context.service';
import { Session } from '../../services/session';
import { FeaturesService } from '../../services/features.service';
import { RecentService } from '../../services/ux/recent';
import { filter } from 'rxjs/operators';
import { PageLayoutService } from '../../common/layout/page-layout.service';
import {
  DiscoveryFeedsContentType,
  DiscoveryFeedsContentFilter,
} from '../discovery/feeds/feeds.service';

@Component({
  selector: 'm-search--bar',
  templateUrl: 'bar.component.html',
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() showCleanIcon: boolean = false;

  active: boolean;
  suggestionsDisabled: boolean = false;
  q: string;
  filter: DiscoveryFeedsContentFilter;
  type: DiscoveryFeedsContentType;
  id: string;
  routerSubscription: Subscription;
  hasSearchContext: boolean = false;
  searchContext: string | Promise<string> = '';
  placeholder: string;

  @ViewChild('searchInput', { static: true }) searchInput: ElementRef;

  @HostBinding('class.m-search--bar--default-sizes')
  @Input()
  defaultSizes: boolean = true;

  @HostBinding('class.m-search__bar--active')
  get showBorders(): boolean {
    return !!this.q || this.active || this.hasRightPane;
  }

  pageLayoutRightPaneSubscription: Subscription;
  hasRightPane = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    public session: Session,
    private context: ContextService,
    private featureService: FeaturesService,
    private recentService: RecentService,
    private pageLayoutService: PageLayoutService
  ) {}

  ngOnInit() {
    this.pageLayoutRightPaneSubscription = this.pageLayoutService.hasRightPane$.subscribe(
      (hasRightPane: boolean) => {
        setTimeout(() => {
          this.hasRightPane = hasRightPane;
        });
      }
    );
    this.listen();
    this.updatePlaceholder();
  }

  ngOnDestroy() {
    this.pageLayoutRightPaneSubscription.unsubscribe();
    this.unListen();
  }

  listen() {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof ActivationEnd))
      .subscribe((event: ActivationEnd) => {
        try {
          const params = event.snapshot.queryParamMap;
          this.q = params.has('q') ? params.get('q') : '';
          this.filter = params.has('f')
            ? <DiscoveryFeedsContentFilter>params.get('f')
            : 'top';
          this.type = params.has('t')
            ? <DiscoveryFeedsContentType>params.get('t')
            : 'all';
        } catch (e) {
          console.error('Minds: router hook(SearchBar)', e);
        }
      });
  }

  unListen() {
    if (this.routerSubscription) this.routerSubscription.unsubscribe();
  }

  handleUrl(url: string) {
    if (url.indexOf('/') === 0) {
      url = url.substr(1);
    }

    let fragments = url.replace(/\//g, ';').split(';');

    if (fragments[0] === 'search') {
      this.hasSearchContext = true;
      this.suggestionsDisabled = true;
      setTimeout(() => this.getActiveSearchContext(fragments), 5);
    } else {
      // this.q = '';
      this.id = '';
      this.hasSearchContext = false;
      this.suggestionsDisabled = false;
    }
  }

  focus() {
    this.active = true;
  }

  blur() {
    setTimeout(() => (this.active = false), 100);
  }

  search() {
    if (this.featureService.has('navigation')) {
      this.router.navigate(['/discovery/search'], {
        queryParams: { q: this.q, f: this.filter, t: this.type },
      });
    } else {
      this.router.navigate([
        '/newsfeed/global/top',
        { query: this.q, period: '30d' },
      ]);
    }

    this.recentService.store('recent:text', this.q);
  }

  @HostListener('keyup', ['$event'])
  keyup(e) {
    if (e.keyCode === 13 && this.session.isLoggedIn()) {
      this.search();
      this.unsetFocus();
    }
  }

  setFocus() {
    if (this.searchInput.nativeElement) {
      this.searchInput.nativeElement.focus();
    }
  }

  unsetFocus() {
    if (this.searchInput.nativeElement) {
      this.searchInput.nativeElement.blur();
    }
  }

  clean() {
    this.q = '';
  }

  protected getActiveSearchContext(fragments: string[]) {
    this.searchContext = '';
    this.id = '';

    fragments.forEach((fragment: string) => {
      let param = fragment.split('=');

      if (param[0] === 'q') {
        this.q = decodeURIComponent(param[1]);
      }

      if (param[0] === 'id') {
        this.id = param[1];
        this.searchContext = this.context.resolveLabel(
          decodeURIComponent(param[1])
        );
      }

      if (param[0] == 'type' && !this.searchContext) {
        this.searchContext = this.context.resolveStaticLabel(
          decodeURIComponent(param[1])
        );
      }
    });
  }

  @HostListener('window:resize')
  onResize(e: Event) {
    this.updatePlaceholder();
  }

  updatePlaceholder(): void {
    this.placeholder = 'Search Minds';
    if (window.innerWidth < 360) {
      this.placeholder = 'Search';
    }
  }
}
