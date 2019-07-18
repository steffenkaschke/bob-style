import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChipListComponent } from './chip-list.component';
import { ChipModule } from '../chip/chip.module';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { OutsideZonePlugin } from '../../services/utils/eventManager.plugins';

@NgModule({
  declarations: [ChipListComponent],
  imports: [CommonModule, ChipModule, AvatarModule],
  exports: [ChipListComponent],
  providers: [
    {
      multi: true,
      provide: EVENT_MANAGER_PLUGINS,
      useClass: OutsideZonePlugin
    }
  ]
})
export class ChipListModule {}
