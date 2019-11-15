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
  ContentChildren,
  QueryList,
  Type,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { QuickFilterBarChangeEvent } from '../quick-filter/quick-filter.interface';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons/buttons.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';

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

  @ContentChildren(BaseFormElement) public formComponents: QueryList<
    BaseFormElement
  >;

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
    this.formComponents.toArray().forEach(formComp => {
      formComp['panelClass'] = 'b-quick-filter-panel';
      formComp['tooltipType'] = TruncateTooltipType.material;
      formComp['doPropagate'] = false;

      (
        formComp['selectChange'] ||
        formComp['changed'] ||
        this.findChangeEmitter(formComp as any)
      ).subscribe(changeEvent => {
        this.onFilterChange(formComp.id, changeEvent);
      });
    });

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

  onFilterChange(key: number | string, changeEvent: any): void {
    this.quickFiltersChanges[key] = changeEvent;
    this.filtersChange.emit(this.quickFiltersChanges);
  }

  onReset(): void {
    this.resetFilters.emit();
  }

  private findChangeEmitter(comp: Type<any>): EventEmitter<any> {
    const possibleEmitters: string[] = Object.keys(comp).filter(
      (k: string): boolean => k.toLowerCase().includes('change')
    );
    const changeEmitter: string = possibleEmitters.find(e => comp[e].observers);
    return changeEmitter ? comp[changeEmitter] : changeEmitter;
  }
}
