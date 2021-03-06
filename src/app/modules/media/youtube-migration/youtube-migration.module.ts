import { NgModule } from '@angular/core';
import { CommonModule as NgCommonModule } from '@angular/common';
import { CommonModule } from '../../../common/common.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { YoutubeMigrationComponent } from './youtube-migration.component';
import { YoutubeMigrationConnectComponent } from './connect/connect.component';
import { YoutubeMigrationDashboardComponent } from './dashboard/dashboard.component';
import { YoutubeMigrationConfigComponent } from './config/config.component';
import { YoutubeMigrationTransferStatusComponent } from './transfer-status/transfer-status.component';
import { YoutubeMigrationService } from './youtube-migration.service';
import { YoutubeMigrationUnmigratedVideosComponent } from './unmigrated-videos/unmigrated-videos.component';
import { YoutubeMigrationMigratedVideosComponent } from './migrated-videos/migrated-videos.component';
import { YoutubeMigrationVideoListComponent } from './video-list/video-list.component';
import { YoutubeMigrationSetupModalComponent } from './setup-modal/setup-modal.component';
import { YoutubeMigrationMarketingComponent } from './marketing/marketing.component';
import { Client } from '../../../services/api';
import { Session } from '../../../services/session';

@NgModule({
  declarations: [
    YoutubeMigrationComponent,
    YoutubeMigrationConnectComponent,
    YoutubeMigrationDashboardComponent,
    YoutubeMigrationConfigComponent,
    YoutubeMigrationTransferStatusComponent,
    YoutubeMigrationUnmigratedVideosComponent,
    YoutubeMigrationMigratedVideosComponent,
    YoutubeMigrationVideoListComponent,
    YoutubeMigrationSetupModalComponent,
    YoutubeMigrationMarketingComponent,
  ],
  imports: [
    CommonModule,
    NgCommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    YoutubeMigrationComponent,
    YoutubeMigrationConnectComponent,
    YoutubeMigrationDashboardComponent,
    YoutubeMigrationMigratedVideosComponent,
    YoutubeMigrationUnmigratedVideosComponent,
    YoutubeMigrationConfigComponent,
  ],
  entryComponents: [
    YoutubeMigrationComponent,
    YoutubeMigrationSetupModalComponent,
  ],
  providers: [
    {
      provide: YoutubeMigrationService,
      useFactory: (client, session) =>
        new YoutubeMigrationService(client, session),
      deps: [Client, Session],
    },
  ],
})
export class YoutubeMigrationModule {}
