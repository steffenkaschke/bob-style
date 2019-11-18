import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [MenuComponent],
  imports: [
    CommonModule,
    MatMenuModule,
    BrowserAnimationsModule,
  ],
  exports: [
    MenuComponent,
  ],
})
export class MenuModule {
}
