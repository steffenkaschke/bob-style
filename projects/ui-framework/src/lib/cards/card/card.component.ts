import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  ElementRef
} from '@angular/core';
import { IconColor, Icons } from '../../icons/icons.enum';
import { ButtonType } from '../../buttons-indicators/buttons/buttons.enum';
import { LinkColor } from '../../buttons-indicators/link/link.enum';
import { BaseCardElement } from './card.abstract';

@Component({
  selector: 'b-card, [b-card]',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  providers: [{ provide: BaseCardElement, useExisting: CardComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent extends BaseCardElement {
  constructor(public cardElRef: ElementRef) {
    super(cardElRef);
  }

  readonly buttonType = ButtonType;
  readonly icons = Icons;
  readonly iconColor = IconColor;
  readonly linkColor = LinkColor;

  @HostBinding('attr.data-focus-inside') menuIsOpened: boolean;

  onMenuOpen(): void {
    this.menuIsOpened = true;
  }

  onMenuClose(): void {
    setTimeout(() => {
      this.menuIsOpened = false;
    }, 150);
  }

  onCtaClick(event): void {
    this.clicked.emit(event);
  }
}
