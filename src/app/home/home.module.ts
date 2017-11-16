import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import { NbSidebarModule, NbLayoutModule, NbSidebarService } from '@nebular/theme';

@NgModule({
  declarations: [
  HomeComponent
  ],
  imports: [
    CommonModule,
    NbSidebarModule,
    NbLayoutModule
  ],
  providers: [NbSidebarService]
})
export class HomeModule {}
