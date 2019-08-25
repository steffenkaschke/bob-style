import { Component, Input, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CollapsibleSectionModule } from './collapsible-section.module';
import { AvatarModule } from '../../buttons-indicators/avatar/avatar.module';
import { TypographyModule } from '../../typography/typography.module';
import { mockAvatar, mockNames, mockJobs, mockDate } from '../../mock.const';
import { LabelValueType } from '../../typography/label-value/label-value.enum';
import { randomNumber } from '../../services/utils/functional-utils';
import { ButtonsModule } from '../../buttons-indicators/buttons/buttons.module';
import { IconColor, Icons } from '../../icons/icons.enum';
import {
  ButtonSize,
  ButtonType
} from '../../buttons-indicators/buttons/buttons.enum';
import { TruncateTooltipModule } from '../../services/truncate-tooltip/truncate-tooltip.module';

@Component({
  selector: 'b-collapsible-section-example-1',
  template: `
    <b-collapsible-section
      [collapsible]="collapsible"
      [expanded]="expanded"
      [disabled]="disabled"
    >
      <div header>
        <div class="cell">
          <b-avatar [imageSource]="avatar.imageSource"></b-avatar>
          <b-label-value
            [type]="labelValueType.three"
            [label]="avatar.label"
            [value]="avatar.value"
          ></b-label-value>
        </div>

        <div class="cell">
          <b-label-value
            [type]="labelValueType.one"
            [label]="holiday.label"
            [value]="holiday.value"
          ></b-label-value>
        </div>

        <div class="cell">
          <b-label-value
            [type]="labelValueType.one"
            [label]="days.label"
            [value]="days.value"
          ></b-label-value>
        </div>

        <div class="cell buttons">
          <b-square-button
            [type]="cancelButton.type"
            [color]="cancelButton.color"
            [size]="cancelButton.size"
            [icon]="cancelButton.icon"
          ></b-square-button>
          <b-square-button
            [type]="confirmButton.type"
            [color]="confirmButton.color"
            [size]="confirmButton.size"
            [icon]="confirmButton.icon"
          ></b-square-button>
        </div>
      </div>
    </b-collapsible-section>
  `,
  styles: [
    ':host {display: block;}',
    ':host::ng-deep [header] { display: flex; jsutify-content: space-between; }',
    ':host::ng-deep [header] .cell { display: flex; flex: 1; align-items: center; }',
    ':host::ng-deep [header] .cell.buttons { flex-grow: 0; }',
    ':host::ng-deep [header] b-avatar { margin-right: 8px; }'
  ]
})
export class CollapsibleSectionExample1Component {
  @Input() collapsible = true;
  @Input() expanded = false;
  @Input() disabled = false;

  readonly labelValueType = LabelValueType;

  public avatar = {
    imageSource: mockAvatar(),
    label: mockNames(1),
    value: mockJobs(1)
  };
  public holiday = {
    label: mockDate(),
    value: 'Holiday'
  };
  public days = {
    label: randomNumber(1, 15),
    value: 'Days'
  };
  public cancelButton = {
    type: ButtonType.tertiary,
    color: IconColor.negative,
    size: ButtonSize.medium,
    icon: Icons.close
  };
  public confirmButton = {
    type: ButtonType.tertiary,
    color: IconColor.positive,
    size: ButtonSize.medium,
    icon: Icons.tick
  };

  constructor() {}
}

@NgModule({
  declarations: [CollapsibleSectionExample1Component],
  imports: [
    BrowserModule,
    CollapsibleSectionModule,
    AvatarModule,
    TypographyModule,
    ButtonsModule,
    TruncateTooltipModule
  ],
  exports: [CollapsibleSectionExample1Component]
})
export class CollapsibleSectionExampleModule {}
