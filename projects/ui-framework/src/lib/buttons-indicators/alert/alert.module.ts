import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import {IconsModule} from '../../icons/icons.module';
import {AlertService} from './alert-service/alert.service';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AlertComponent],
  entryComponents: [AlertComponent],
  imports: [
    CommonModule,
    IconsModule,
  ],
  exports: [AlertComponent],
  providers: [AlertService],
})
export class AlertModule { }
