import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import { AppRoutingModule } from '../app-routing.module';

import {
  NbActionsModule,
  NbCardModule,
  NbLayoutModule,
  NbMenuModule,
  NbRouteTabsetModule,
  NbSearchModule,
  NbSidebarModule,
  NbTabsetModule,
  NbThemeModule,
  NbUserModule,
  NbCheckboxModule,
  NbSidebarService,
} from '@nebular/theme';

@NgModule({
  declarations: [
  HomeComponent
  ],
  imports: [
    CommonModule,
    NbActionsModule,
    NbCardModule,
    NbLayoutModule,
    NbMenuModule,
    NbRouteTabsetModule,
    NbSearchModule,
    NbSidebarModule,
    NbTabsetModule,
    NbThemeModule,
    NbUserModule,
    NbCheckboxModule,
    NbMenuModule,
    NbSidebarModule,
    NbLayoutModule,
    NbActionsModule,
    AppRoutingModule
  ],
  providers: [NbSidebarService]
})
export class HomeModule {}
