import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { Breadcrumb, BreadcrumbNavButtons } from './breadcrumbs.interface';
import { Subscription } from 'rxjs';
import { UtilsService } from '../../utils/utils.service';
import { ButtonSize, ButtonType } from '../../buttons-indicators/buttons/buttons.enum';

@Component({
  selector: 'b-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements AfterViewInit, OnDestroy {
  @ViewChild('breadcrumbsContainer') breadcrumbsContainer;
  public isSmallMode = false;
  public resizeSubscription: Subscription;
  public buttonSize = ButtonSize;
  public buttonType = ButtonType;

  @Input() breadcrumbs: Breadcrumb[];
  @Input() buttons: BreadcrumbNavButtons;
  @Input() activeIndex: number;
  @Output() stepClick: EventEmitter<number> = new EventEmitter<number>();
  @Output() nextClick: EventEmitter<void> = new EventEmitter<void>();
  @Output() prevClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(public utilsService: UtilsService) {}

  ngAfterViewInit() {
    this.setIsSmallMode();
    this.resizeSubscription = this.utilsService.getResizeEvent().subscribe(() => {
      this.setIsSmallMode();
    });
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  private setIsSmallMode() {
    this.isSmallMode =
      this.breadcrumbsContainer.nativeElement.offsetWidth <
      this.breadcrumbsContainer.nativeElement.scrollWidth;
  }

  onStepClick($event, stepIndex): void {
    this.stepClick.emit(stepIndex);
  }

  onNextClick(): void {
    this.nextClick.emit();
  }

  onPrevClick(): void {
    this.prevClick.emit();
  }
}
