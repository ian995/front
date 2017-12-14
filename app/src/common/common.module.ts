import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MINDS_PIPES } from './pipes/pipes';

import { TopbarComponent } from './layout/topbar/topbar.component';
import { TopbarNavigationComponent } from './layout/topbar/navigation.component';
import { SidebarNavigationComponent } from './layout/sidebar/navigation.component';

import { TooltipComponent } from './components/tooltip/tooltip.component';
import { FooterComponent } from './components/footer/footer.component';
import { InfiniteScroll } from './components/infinite-scroll/infinite-scroll';
import { CountryInputComponent } from './components/forms/country-input/country-input.component';
import { DateInputComponent } from './components/forms/date-input/date-input.component';
import { StateInputComponent } from './components/forms/state-input/state-input.component';
import { ReadMoreDirective } from './read-more/read-more.directive';
import { ReadMoreButtonComponent } from './read-more/button.component';
import { ChannelBadgesComponent } from './components/badges/badges.component';

import { Scheduler } from './components/scheduler/scheduler';
import { Modal } from './components/modal/modal.component';
import { MindsRichEmbed } from './components/rich-embed/rich-embed';

import { MDL_DIRECTIVES } from './directives/material';
import { AutoGrow } from './directives/autogrow';
import { InlineAutoGrow } from './directives/inline-autogrow';
import { Emoji } from './directives/emoji';
import { Hovercard } from './directives/hovercard';
import { ScrollLock } from './directives/scroll-lock';
import { TagsLinks } from './directives/tags';
import { Tooltip } from './directives/tooltip';
import { MindsAvatar } from './components/avatar/avatar';
import { CaptchaComponent } from './components/captcha/captcha.component';
import { Textarea } from './components/editors/textarea.component';
import { MindsTinymce } from './components/editors/tinymce';
import { TagcloudComponent } from './components/tagcloud/tagcloud.component';

import { DynamicHostDirective } from './directives/dynamic-host.directive';
import { MindsCard } from './components/card/card.component';
import { MindsButton } from './components/button/button.component';
import { OverlayModalComponent } from './components/overlay-modal/overlay-modal.component';

import { FaqComponent } from './components/faq/faq.component';
import { ChartComponent } from './components/chart/chart.component';
import { DateSelectorComponent } from './components/date-selector/date-selector.component';
import { AdminActionsButtonComponent } from './components/button/admin-actions/admin-actions.component';
import { InlineEditorComponent } from './components/editors/inline-editor.component';
import { AttachmentService } from "../services/attachment";
import { MaterialBoundSwitchComponent } from './components/material/bound-switch.component';
import { IfFeatureDirective } from './directives/if-feature.directive';
import { MindsEmoji } from './components/emoji/emoji';
import { CategoriesSelectorComponent } from './components/categories/selector/selector.component';
import { CategoriesSelectedComponent } from './components/categories/selected/selected.component';
import { TreeComponent } from './components/tree/tree.component';
import { AnnouncementComponent } from './components/announcements/announcement.component';
import { MindsTokenSymbolComponent } from './components/cypto/token-symbol.component';

@NgModule({
  imports: [
    NgCommonModule,
    RouterModule,
    FormsModule
  ],
  declarations: [
    MINDS_PIPES,

    TopbarComponent,
    TopbarNavigationComponent,
    SidebarNavigationComponent,

    TooltipComponent,
    FooterComponent,
    InfiniteScroll,
    CountryInputComponent,
    DateInputComponent,
    StateInputComponent,
    Scheduler,
    Modal,
    ReadMoreDirective,
    ReadMoreButtonComponent,
    ChannelBadgesComponent,
    MindsRichEmbed,
    TagcloudComponent,

    AutoGrow,
    InlineAutoGrow,
    Emoji,
    MindsEmoji,
    Hovercard,
    ScrollLock,
    TagsLinks,
    Tooltip,
    MDL_DIRECTIVES,
    DateSelectorComponent,
    MindsAvatar,
    CaptchaComponent,
    Textarea,
    MindsTinymce,
    InlineEditorComponent,

    DynamicHostDirective,
    MindsCard,
    MindsButton,

    FaqComponent,
    ChartComponent,
    OverlayModalComponent,

    AdminActionsButtonComponent,

    MaterialBoundSwitchComponent,

    IfFeatureDirective,

    CategoriesSelectorComponent,
    CategoriesSelectedComponent,
    TreeComponent,

    AnnouncementComponent,
    MindsTokenSymbolComponent,
  ],
  exports: [
    MINDS_PIPES,

    TopbarComponent,
    SidebarNavigationComponent,

    TooltipComponent,
    FooterComponent,
    InfiniteScroll,
    CountryInputComponent,
    DateInputComponent,
    StateInputComponent,
    Scheduler,
    Modal,
    ReadMoreDirective,
    ReadMoreButtonComponent,
    ChannelBadgesComponent,
    MindsRichEmbed,
    TagcloudComponent,

    AutoGrow,
    InlineAutoGrow,
    MindsEmoji,
    Emoji,
    Hovercard,
    ScrollLock,
    TagsLinks,
    Tooltip,
    MDL_DIRECTIVES,
    DateSelectorComponent,
    MindsAvatar,
    CaptchaComponent,
    Textarea,
    MindsTinymce,
    InlineEditorComponent,

    DynamicHostDirective,
    MindsCard,
    MindsButton,

    FaqComponent,
    ChartComponent,
    OverlayModalComponent,

    AdminActionsButtonComponent,

    MaterialBoundSwitchComponent,

    IfFeatureDirective,

    CategoriesSelectorComponent,
    CategoriesSelectedComponent,
    TreeComponent,

    AnnouncementComponent,
    MindsTokenSymbolComponent,
  ],
  providers: [
    AttachmentService
  ],
})

export class CommonModule {}
