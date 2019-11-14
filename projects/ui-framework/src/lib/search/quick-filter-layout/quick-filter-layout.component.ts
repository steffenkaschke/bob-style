import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
  NgZone,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { QuickFilterBarChangeEvent } from '../quick-filter/quick-filter.interface';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons/buttons.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';

@Component({
  selector: 'b-quick-filter-layout',
  templateUrl: './quick-filter-layout.component.html',
  styleUrls: ['../quick-filter/quick-filter-bar.component.scss'],
  animations: [
    trigger('reset', [
      transition(':enter', [
        style({ transform: 'scale(0.4)' }),
        animate(
          '350ms cubic-bezier(0.3,1.55,0.85,1.45)',
          style({ transform: 'scale(1)' })
        ),
      ]),
      transition(':leave', [
        style({ transform: 'scale(1)' }),
        animate(
          '350ms cubic-bezier(0.8,-0.9,0.95,0.4)',
          style({ transform: 'scale(0.4)' })
        ),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickFilterLayoutComponent implements OnInit, AfterViewInit {
  constructor(
    private DOM: DOMhelpers,
    private zone: NgZone,
    private cd: ChangeDetectorRef
  ) {}

  @ViewChild('prefix', { static: false }) prefix: ElementRef;
  @ViewChild('suffix', { static: false }) suffix: ElementRef;

  @Input() showResetFilter = false;

  @Output() filtersChange: EventEmitter<
    QuickFilterBarChangeEvent
  > = new EventEmitter<QuickFilterBarChangeEvent>();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();

  quickFiltersChanges: QuickFilterBarChangeEvent = {};

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;
  readonly buttonType = ButtonType;
  public hasPrefix = true;
  public hasSuffix = true;

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.hasPrefix = !this.DOM.isEmpty(this.prefix.nativeElement);
        this.hasSuffix = !this.DOM.isEmpty(this.suffix.nativeElement);

        if (!this.cd['destroyed']) {
          this.cd.detectChanges();
        }
      }, 0);
    });
  }
}
