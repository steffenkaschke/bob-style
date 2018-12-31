import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule, MatRippleModule } from '@angular/material';
import { ButtonComponent } from './button/button.component';
import { SquareButtonComponent } from '../buttons/square/square.component';
import { GroupComponent } from './group/group.component';
import '../style/style.scss';

@NgModule({
  declarations: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatRippleModule
  ],
  exports: [
    ButtonComponent,
    SquareButtonComponent,
    GroupComponent
  ]
})
export class ButtonsModule { }
