import { NgModule } from '@angular/core';
import { TextareaComponent } from './textarea.component';
import { MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    TextareaComponent,
  ],
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    FormsModule,
  ],
  exports: [
    TextareaComponent,
  ],
  providers: [TextareaComponent],
})
export class TextareaModule {
}
