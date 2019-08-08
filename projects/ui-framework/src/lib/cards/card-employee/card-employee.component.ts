import {
  Component,
  ElementRef,
  Input,
  ChangeDetectorRef,
  DoCheck
} from '@angular/core';
import { AvatarSize } from '../../buttons-indicators/avatar/avatar.enum';
import { CardEmployee } from './card-employee.interface';
import { BaseCardElement } from '../card/card.abstract';
import { isEmptyObject, isObject } from '../../services/utils/functional-utils';

@Component({
  selector: 'b-card-employee, [b-card-employee]',
  templateUrl: './card-employee.component.html',
  styleUrls: ['./card-employee.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardEmployeeComponent }]
})
export class CardEmployeeComponent extends BaseCardElement implements DoCheck {
  constructor(public cardElRef: ElementRef, private cd: ChangeDetectorRef) {
    super(cardElRef);
  }

  readonly avatarSize = AvatarSize;

  @Input() card: CardEmployee;

  onClick($event: MouseEvent) {
    this.clicked.emit($event);
  }

  ngDoCheck() {
    this.setCssVars();
  }

  private setCssVars(): void {
    if (
      this.cardElRef &&
      this.card &&
      !this.cardElRef.nativeElement.hasAttribute('style')
    ) {
      this.cardElRef.nativeElement.style.setProperty(
        '--background-color-1',
        `${this.card.coverColors.color1}`
      );
      this.cardElRef.nativeElement.style.setProperty(
        '--background-color-2',
        `${this.card.coverColors.color2}`
      );
    }
  }
}
