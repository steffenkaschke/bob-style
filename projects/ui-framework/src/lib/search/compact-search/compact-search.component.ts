import { Component, ElementRef, EventEmitter, HostBinding, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormElementSize } from '../../form-elements/form-elements.enum';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'b-compact-search',
  templateUrl: './compact-search.component.html',
  styleUrls: ['./compact-search.component.scss']
})
export class CompactSearchComponent implements OnInit {
  @ViewChild('search') search: SearchComponent;

  @Input() value = '';
  @Input() placeholder: string;

  @Output() searchChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() searchFocus: EventEmitter<string> = new EventEmitter<string>();

  readonly formElementSize = FormElementSize;

  open = false;

  constructor() { }

  ngOnInit(): void {
  }

  onSearchOpen(): void {
    this.open = true;
    setTimeout(() => {
      this.search.input.nativeElement.focus();
    }, 300);
  }

  onSearchClose(): void {
    this.search.inputFocused = false;
    this.open = false;
  }

  onSearchChange(event: string): void {
    this.searchChange.emit(event);
  }
}
