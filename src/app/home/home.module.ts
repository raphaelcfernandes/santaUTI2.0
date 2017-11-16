import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import { NbSidebarModule, NbLayoutModule, NbSidebarService, NbActionsModule } from '@nebular/theme';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [
  HomeComponent
  ],
  imports: [
    CommonModule,
    NbSidebarModule,
    NbLayoutModule,
    NbActionsModule,
    AppRoutingModule
  ],
  providers: [NbSidebarService]
})
export class HomeModule {}
