import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter,
  Input,
  NgZone,
  OnChanges, Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Icons } from '../../icons/icons.enum';
import {
  applyChanges,
  hasChanges,
  isBoolean,
  simpleUID,
} from '../../services/utils/functional-utils';
import { COLLAPSIBLE_STYLE_DEF } from './collapsible.const';
import { CollapsibleStyle } from './collapsible.interface';

@Component({
  selector: 'b-collapsible',
  templateUrl: './collapsible.component.html',
  styleUrls: ['./collapsible.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapsibleComponent implements OnChanges {
  constructor(private zone: NgZone, private cd: ChangeDetectorRef) {}

  @ViewChild('section', { static: true }) section: ElementRef<
    HTMLDetailsElement
  >;
  @Output() onCollapsed: EventEmitter<void> = new EventEmitter<void>();
  @Output() onExpanded: EventEmitter<void> = new EventEmitter<void>();
  @Input() id: string = simpleUID('bcl');
  @Input() title: string;
  @Input() config: CollapsibleStyle = COLLAPSIBLE_STYLE_DEF;
  @Input() animate: boolean;

  @Input('startExpaned') set setStartExpaned(startExpaned: boolean) {
    if (isBoolean(startExpaned) && this.section) {
      this.section.nativeElement.open = this.expanded = startExpaned;
    }
  }

  public expanded = false;
  public shouldAnimate = false;
  public chevronIcon: string = Icons.chevron_right.replace('b-icon-', '');
  private timeout: any;

  ngOnChanges(changes: SimpleChanges): void {
    applyChanges(
      this,
      changes,
      {
        config: COLLAPSIBLE_STYLE_DEF,
      },
      [],
      true
    );

    if (hasChanges(changes, ['config'], true)) {
      this.config = { ...COLLAPSIBLE_STYLE_DEF, ...this.config };

      this.chevronIcon = (
        this.config?.chevronIcon?.icon || Icons.chevron_right
      ).replace('b-icon-', '');
    }

    this.animate = Boolean(this.animate || this.config?.animate);
  }

  public expand(expand = true) {
    this.section.nativeElement.open = this.expanded = expand;
  }

  public collapse(collapse = true) {
    this.section.nativeElement.open = this.expanded = !collapse;
    this.onCollapsed.emit();
  }

  public onExpand(event: Event) {
    this.addAnimation();
    this.expanded = event.target['open'];
    this.cd.detectChanges();
    this.onExpanded.emit();
  }

  private addAnimation() {
    if (this.animate !== true) {
      return;
    }
    this.shouldAnimate = true;
    clearTimeout(this.timeout);

    this.zone.runOutsideAngular(() => {
      this.timeout = setTimeout(() => {
        this.shouldAnimate = false;
        this.cd.detectChanges();
      }, 300);
    });
  }
}
