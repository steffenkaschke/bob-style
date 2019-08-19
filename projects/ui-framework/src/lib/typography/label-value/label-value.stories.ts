import { storiesOf } from '@storybook/angular';
import { text, withKnobs, select } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TypographyModule } from '../typography.module';
import { LabelValueType, TextAlign, IconPosition } from './label-value.enum';
import { randomNumber } from '../../services/utils/functional-utils';
import { mockText } from '../../mock.const';
import { Icons } from '../../icons/icons.enum';

const story = storiesOf(ComponentGroupType.Typography, module).addDecorator(
  withKnobs
);

const template = `
  <b-label-value
        [type]="type"
        [textAlign]="textAlign"
        [label]="label"
        [value]="value"
        [icon]="icon"
        [iconPosition]="iconPosition"></b-label-value>
`;

const template2 = `
  <style>
    .cont {
      border-top: 1px solid #535353;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 50px;
      text-align: left;
    }
    .cell {
      width: 48%;
      margin-top: 40px;
    }
    .hdr {
      margin: 0 0 10px 0;
    }
    .bx {
      display: inline-block;
      font-size: 11px;
      font-weight: 600;
      padding: 3px 5px;
      background-color: #e2e2e2;
    }
  </style>

  <div class="cont">

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.one</span>
      </p>
      <b-label-value
        [type]="'1'"
        [label]="'01/06/2019'"
        [value]="'Holiday'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.two</span>
      </p>
      <b-label-value
        [type]="'2'"
        [label]="'Reason'"
        [value]="'Im planning a trip to celebrate my birthday.'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.three</span>
      </p>
      <b-label-value
        [type]="'3'"
        [label]="'Alan Tulins'"
        [value]="'Product designer'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.four</span>
      </p>
      <b-label-value
        [type]="'4'"
        [label]="'Current balance'"
        [value]="'4.25'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.five</span>
      </p>
      <b-label-value
        [type]="'5'"
        [label]="'Elsie Hunter'"
        [value]="'11/03/2019'"></b-label-value>
    </div>

    <div class="cell">
      <p class="hdr">
        <span class="bx">LabelValueType.five</span>
        <span class="bx">TextAlign.center</span>
      </p>
      <b-label-value
        [type]="'6'"
        [textAlign]="'center'"
        [label]="'Larry Murfiray'"
        [value]="'Marketing & business operati…'"></b-label-value>
    </div>

  </div>


`;

const storyTemplate = `
<b-story-book-layout [title]="'Label-Value'" style="background-color: rgb(247,247,247);">
    <div>
      <div style="display: inline-block; margin: 0 auto;">${template}</div>
      ${template2}
    </div>
</b-story-book-layout>
`;

const note = `
  ## Label-Value

  #### Module
  *TypographyModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  label | string | label/title text | none
  value | string | value text | none
  ~~~
  ${template}
  ~~~
`;

story.add(
  'Label-Value',
  () => {
    return {
      template: storyTemplate,
      props: {
        type: select('type', [Object.values(LabelValueType)
          , LabelValueType.one),
        textAlign: select(
          'textAlign',
          Object.values(TextAlign),
          TextAlign.left
        ),
        label: text('label', mockText(randomNumber(2, 3))),
        value: text('value', mockText(randomNumber(3, 6))),
        icon: select('icon', Object.values(Icons), null),
        iconPosition: select(
          'iconPosition',
          Object.values(IconPosition),
          IconPosition.left
        )
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          TypographyModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
