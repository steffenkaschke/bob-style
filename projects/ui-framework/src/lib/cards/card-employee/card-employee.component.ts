import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';
import { AvatarSize } from '../../buttons-indicators/avatar/avatar.enum';
import { CardEmployee } from './card-employee.interface';
import { has } from 'lodash';
import { BaseCardElement } from '../card/card.abstract';

@Component({
  selector: 'b-card-employee, [b-card-employee]',
  templateUrl: './card-employee.component.html',
  styleUrls: ['./card-employee.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardEmployeeComponent }]
})
export class CardEmployeeComponent extends BaseCardElement
  implements OnChanges {
  constructor(public cardElRef: ElementRef, private cd: ChangeDetectorRef) {
    super(cardElRef);
  }

  readonly avatarSize = AvatarSize;

  @Input() card: CardEmployee;

  onClick($event: MouseEvent) {
    this.clicked.emit($event);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setCssVars();
  }

  private setCssVars(): void {
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
