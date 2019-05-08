import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Icons } from '../../icons/icons.enum';

@Component({
  selector: 'b-add-file',
  templateUrl: './add-file.component.html',
  styleUrls: ['./add-file.component.scss']
})
export class AddFileComponent implements OnChanges {
  @Input() icon: Icons;
  @Input() imageUrl?: string;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();
  selectedIcon: string;
  iconColor: string;
  constructor() {
  }
  ngOnChanges(): void {
    this.selectedIcon = this.imageUrl ? 'pencil_icon' : this.icon;
  }
  @HostListener('click', ['$event'])
  onClick($event) {
    this.clicked.emit($event);
  }
  updateIconClass() {
    if (this.imageUrl) {
      this.iconColor = 'white';
    }
  }

}
