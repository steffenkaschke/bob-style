import {
  Component,
  OnInit,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  SimpleChanges,
  OnChanges,
  ElementRef,
  Output
} from '@angular/core';
import { LabelValueType, TextAlign, IconPosition } from './label-value.enum';
import { Icons } from '../../icons/icons.enum';

@Component({
  selector: 'b-label-value',
  templateUrl: './label-value.component.html',
  styleUrls: ['./label-value.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabelValueComponent implements OnChanges {
  constructor(private host: ElementRef) {}

  @Input() label: string | number;
  @Input() value: string | number;
  @Input() icon: Icons;

  @Output() valueClicked;
  @Output() labelClicked;

  @HostBinding('attr.data-type') @Input() type: LabelValueType =
    LabelValueType.one;

  @HostBinding('attr.data-text-align') @Input() textAlign: TextAlign =
    TextAlign.left;

  @HostBinding('attr.data-icon-position') @Input() iconPosition: IconPosition =
    IconPosition.left;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.icon && changes.icon.currentValue) {
      this.icon = changes.icon.currentValue;
      this.host.nativeElement.classList.add(this.icon);
    }
  }
}
