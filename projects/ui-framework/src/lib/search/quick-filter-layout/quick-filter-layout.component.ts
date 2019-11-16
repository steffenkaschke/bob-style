import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  NgZone,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  ContentChildren,
  QueryList,
  OnDestroy,
  DoCheck,
  SimpleChanges,
  OnChanges,
  AfterContentInit,
} from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { QuickFilterConfig } from '../quick-filter/quick-filter.interface';
import { Icons, IconSize, IconColor } from '../../icons/icons.enum';
import { DOMhelpers } from '../../services/html/dom-helpers.service';
import { BaseFormElement } from '../../form-elements/base-form-element';
import { TruncateTooltipType } from '../../popups/truncate-tooltip/truncate-tooltip.enum';
import { BaseButtonElement } from '../../buttons/button.abstract';
import { GenericObject } from '../../types';
import {
  applyChanges,
  notFirstChanges,
  onlyUpdatedProps,
  asArray,
  arrayDifference,
  hasProp,
} from '../../services/utils/functional-utils';
import { simpleChange } from '../../services/utils/test-helpers';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { keyBy } from 'lodash';

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
export class QuickFilterLayoutComponent
  implements DoCheck, OnChanges, OnInit, AfterContentInit, OnDestroy {
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
  @ContentChildren(BaseButtonElement) public actionButtons: QueryList<
    BaseButtonElement
  >;

  @Input() quickFilters: QuickFilterConfig[];
  @Input() showResetFilter = false;

  @Output() filtersChange: EventEmitter<GenericObject> = new EventEmitter<
    GenericObject
  >();
  @Output() resetFilters: EventEmitter<void> = new EventEmitter<void>();

  public value: GenericObject = {};
  public hasPrefix = true;
  public hasSuffix = true;

  private firstInitDone = false;
  private formCompCount = 0;
  private actButtsCount = 0;
  private formCompEmittersMap: GenericObject = {};
  private emitDebouncer: Subject<GenericObject> = new Subject<GenericObject>();

  private subscribtions: Subscription[] = [];

  readonly icons = Icons;
  readonly iconSize = IconSize;
  readonly iconColor = IconColor;

  ngDoCheck(): void {
    if (
      this.firstInitDone &&
      this.formComponents &&
      this.formComponents.length !== this.formCompCount
    ) {
      if (this.formComponents.length < this.formCompCount) {
        const deletedIDs = arrayDifference(
          this.formComponents.toArray().map(cmp => cmp.id),
          Object.keys(this.formCompEmittersMap)
        );

        deletedIDs.forEach(id => {
          delete this.formCompEmittersMap[id];
          delete this.value[id];
        });
      }
      this.initFormElements();
    }

    if (
      this.firstInitDone &&
      this.actionButtons &&
      this.actionButtons.length !== this.actButtsCount
    ) {
      this.initActionButtons();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(this, changes);

    if (notFirstChanges(changes, ['quickFilters'])) {
      const updatedCompProps = onlyUpdatedProps(
        keyBy(changes.quickFilters.previousValue, 'key'),
        keyBy(changes.quickFilters.currentValue, 'key')
      );

      this.assignFormCompAttrs(Object.values(
        updatedCompProps
      ) as QuickFilterConfig[]);

      this.initValue(Object.keys(updatedCompProps).map(key =>
        this.formComponents.toArray().find(comp => comp.id === key)
      ) as BaseFormElement[]);
    }
  }

  ngOnInit() {
    this.emitDebouncer.pipe(debounceTime(300)).subscribe(value => {
      this.filtersChange.emit(value);
      console.log(this.value);
    });
  }

  ngAfterContentInit(): void {
    if (this.formComponents) {
      this.initFormElements();
    }
    if (this.actionButtons) {
      this.initActionButtons();
    }
    this.firstInitDone = true;
  }

  private initFormElements(): void {
    this.formCompCount = this.formComponents.length;

    this.formComponents.toArray().forEach(formComp => {
      if (!Object.keys(this.formCompEmittersMap).includes(formComp.id)) {
        Object.assign(formComp, {
          panelClass: 'b-quick-filter-panel',
          tooltipType: TruncateTooltipType.material,
          doPropagate: false,
          wrapEvent: false,
        });

        this.subscribtions.push(
          this.getChangeEmitter(formComp as any).subscribe(
            (changeEvent: any) => {
              this.onFilterChange(formComp.id, changeEvent);
            }
          )
        );

        if (this.quickFilters) {
          this.assignFormCompAttrs(this.quickFilters, formComp);
        }

        this.initValue(formComp);
      }
    });
  }

  private assignFormCompAttrs(
    quickFilters: QuickFilterConfig[] = this.quickFilters,
    formComp: BaseFormElement | BaseFormElement[] = null
  ): void {
    (formComp ? asArray(formComp) : this.formComponents.toArray()).forEach(
      cmp => {
        cmp.ngOnChanges(
          simpleChange(quickFilters.find(fltr => fltr.key === cmp.id))
        );
      }
    );
  }

  private initValue(
    formComp: BaseFormElement | BaseFormElement[] = null
  ): void {
    (formComp ? asArray(formComp) : this.formComponents.toArray()).forEach(
      cmp => {
        if (cmp !== undefined) {
          this.value[cmp.id] = cmp['options'] ? cmp['options'] : cmp.value;
        }
      }
    );
  }

  private initActionButtons(): void {
    this.actButtsCount = this.actionButtons.length;

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

  ngOnDestroy(): void {
    this.emitDebouncer.complete();
    this.emitDebouncer.unsubscribe();

    this.subscribtions.forEach(sub => {
      sub.unsubscribe();
      sub = null;
    });
    this.subscribtions = null;
  }

  onFilterChange(key: string, changeEvent: any): void {
    this.value[key] = changeEvent;
    this.emitDebouncer.next(this.value);
  }

  onReset(): void {
    if (this.resetFilters.observers.length > 0) {
      this.resetFilters.emit();
    } else if (this.quickFilters) {
      this.assignFormCompAttrs(
        this.quickFilters.map(fltr => ({
          ...fltr,
          value: hasProp(fltr, 'value') ? fltr.value : null,
        }))
      );
      this.initValue();
      this.emitDebouncer.next(this.value);
    }
  }

  private findChangeEmitterKey(formComp: BaseFormElement): string {
    return (this.formCompEmittersMap[formComp.id] = formComp['selectChange']
      ? 'selectChange'
      : Object.keys(formComp).find(
          (key: string): boolean =>
            /change|inputEvents/i.test(key) && formComp[key].observers
        ));
  }

  private getChangeEmitter(formComp: BaseFormElement): EventEmitter<any> {
    return formComp[
      this.formCompEmittersMap[formComp.id] ||
        this.findChangeEmitterKey(formComp)
    ];
  }
}
