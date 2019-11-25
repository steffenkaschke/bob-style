import {
  Component,
  OnInit,
  Input,
  ElementRef,
  NgZone,
  SimpleChanges,
  OnChanges,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { filter, take, throttleTime, startWith } from 'rxjs/operators';
import { merge } from 'rxjs';
import {
  applyChanges,
  notFirstChanges,
  simpleUID,
  numberMinMax,
  randomNumber
} from '../../services/utils/functional-utils';
import { valueAsNumber } from '../../services/utils/transformers';
import { UtilsService } from '../../services/utils/utils.service';
import { outsideZone } from '../../services/utils/rxjs.operators';
import { InputTypes } from '../../form-elements/input/input.enum';
import { ProgressBarType, ProgressBarSize } from './progress-bar.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { ProgressBarData, ProgressBarConfig } from './progress-bar.interface';

@Component({
  selector: 'b-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent implements OnChanges, OnInit {
  constructor(
    private host: ElementRef,
    private utilsService: UtilsService,
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @HostBinding('attr.data-type') @Input() type: ProgressBarType = ProgressBarType.primary;
  @HostBinding('attr.data-size') @Input() size: ProgressBarSize = ProgressBarSize.medium;

  @Input() color: string;
  @Input() value: number;
  @Input() data: ProgressBarData;
  @Input() config: ProgressBarConfig = {};

  readonly id = simpleUID('bpb-');
  readonly barType = ProgressBarType;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (changes.value) {
      this.value = numberMinMax(valueAsNumber(InputTypes.number, this.value, 0), 0, 100);
    }

    if (notFirstChanges(changes, ['color', 'value'])) {
      this.setCssProps();
    }

    if (notFirstChanges(changes) && !this.cd['destroyed']) {
      this.cd.detectChanges();
    }
  }

  ngOnInit() {
    if (!this.config.disableAnimation) {
      merge(this.utilsService.getScrollEvent(), this.utilsService.getResizeEvent())
        .pipe(
          outsideZone(this.zone),
          startWith(1),
          throttleTime(300, undefined, {
            leading: true,
            trailing: true
          }),
          filter(() => this.DOM.isInView(this.host.nativeElement)),
          take(1)
        )
        .subscribe(() => {
          this.setCssProps();
        });
    }
  }

  private setCssProps(): void {
    this.DOM.setCssProps(this.host.nativeElement, {
      '--bpb-value': this.value + '%',
      '--bpb-color': (this.type !== ProgressBarType.secondary && this.color) || null,
      '--bpb-trans': this.config.disableAnimation
        ? '0s'
        : (this.value > 50 ? randomNumber(1000, 2000) : randomNumber(500, 1000)) + 'ms',
      '--bpb-trans-delay': this.config.disableAnimation ? '0s' : randomNumber(0, 200) + 'ms'
    });
  }
}
