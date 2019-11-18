import {
  Component,
  Input,
  HostBinding,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import {
  TruncateTooltipPosition,
  TruncateTooltipType,
} from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { IconColor, Icons, IconSize } from '../../icons/icons.enum';
import { TooltipClass } from '../../popups/tooltip/tooltip.enum';
import { notFirstChanges } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-form-element-label',
  templateUrl: './form-element-label.component.html',
  styleUrls: ['./form-element-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormElementLabelComponent implements OnChanges {
  constructor(private cd: ChangeDetectorRef) {}
  @Input() label: string;
  @Input() description: string;
  @Input() fieldId: string | number;

  @HostBinding('class.bfe-label') classname = true;

  readonly truncateTooltipType = TruncateTooltipType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly iconSize = IconSize;
  readonly delay = 300;
  readonly truncateTooltipPosition = TruncateTooltipPosition;
  readonly tooltipClass: TooltipClass[] = [
    TooltipClass.TextLeft,
    TooltipClass.PreWrap,
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }
}
