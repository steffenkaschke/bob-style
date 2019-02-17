import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilsService } from './utils.service';

@NgModule({
  imports: [CommonModule],
  providers: [UtilsService]
})
export class UtilsModule {}
