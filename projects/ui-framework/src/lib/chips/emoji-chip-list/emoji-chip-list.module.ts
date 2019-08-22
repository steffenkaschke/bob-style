import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmojiChipListComponent } from './emoji-chip-list.component';
import { EmojiFromCodePipe } from './emoji-from-code.pipe';

@NgModule({
  declarations: [EmojiChipListComponent, EmojiFromCodePipe],
  imports: [
    CommonModule
  ],
  exports: [EmojiChipListComponent, EmojiFromCodePipe]
})
export class EmojiChipListModule { }
