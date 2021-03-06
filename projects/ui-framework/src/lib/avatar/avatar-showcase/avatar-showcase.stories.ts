import { cloneDeep, zipObject } from 'lodash';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import {
  boolean,
  number,
  object,
  select,
  withKnobs,
} from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/angular';

import { ComponentGroupType } from '../../consts';
import { SelectGroupOption } from '../../lists/list.interface';
import { cloneDeepSimpleObject } from '../../services/utils/functional-utils';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { AvatarSize } from '../avatar/avatar.enum';
import { AvatarShowcase } from './avatar-showcase.interface';
import {
  EMPLOYEE_SHOWCASE_MOCK,
  EMPLOYEE_SHOWCASE_OPTIONS_MOCK,
} from './avatar-showcase.mock';
import { EmployeesShowcaseModule } from './avatar-showcase.module';

const story = storiesOf(ComponentGroupType.Avatar, module).addDecorator(
  withKnobs
);

const sizeOptionsKeys = Object.values(AvatarSize).filter(
  (key) => typeof key === 'string'
) as string[];
const sizeOptionsValues = Object.values(AvatarSize).filter(
  (key) => typeof key === 'number'
) as number[];
const sizeOptions = zipObject(sizeOptionsKeys, sizeOptionsValues);

const template1 = `
  <b-avatar-showcase
            [employees]="employees.slice(0,numOfMockAvatars)"
            [avatarSize]="avatarSize"
            [min]="min"
            [max]="max"
            [showTotal]="showTotal"
            [showTotalLabel]="showTotalLabel"
            [expandOnClick]="expandOnClick"
            [inverseStack]="inverseStack"
            [fadeOut]="fadeOut"
            [zoomOnHover]="zoomOnHover"
            [readonly]="readonly"
            [hasBackdrop]="hasBackdrop || undefined"
            [doShuffle]="doShuffle"
            (selectChange)="selectChange($event)">
  </b-avatar-showcase>
`;

const template1ForNotes = `
  <b-avatar-showcase
            [employees]="employees"
            [avatarSize]="avatarSize"
            [min]="min"
            [max]="max"
            [showTotal]="showTotal"
            [showTotalLabel]="showTotalLabel"
            [expandOnClick]="expandOnClick"
            [inverseStack]="inverseStack"
            [fadeOut]="fadeOut"
            [zoomOnHover]="zoomOnHover"
            [readonly]="readonly"
            [doShuffle]="doShuffle"
            (selectChange)="selectChange($event)">
  </b-avatar-showcase>
`;

const template2 = `
  <b-avatar-showcase
            [employees]="employeeOptions"
            [avatarSize]="avatarSizes.small"
            [min]="3"
            [max]="8"
            [showTotal]="true"
            [showTotalLabel]="showTotalLabel"
            [expandOnClick]="true"
            [inverseStack]="true"
            [fadeOut]="true"
            [zoomOnHover]="false"
            [readonly]="true"
            [doShuffle]="doShuffle"
            [hasBackdrop]="hasBackdrop || undefined">
  </b-avatar-showcase>
`;

const template3 = `
  <b-avatar-showcase
            [employees]="employees.slice().reverse()"
            [avatarSize]="avatarSizes.mini"
            [min]="3"
            [max]="6"
            [showTotal]="true"
            [expandOnClick]="true"
            [inverseStack]="false"
            [fadeOut]="false"
            [zoomOnHover]="false"
            [readonly]="true"
            [doShuffle]="doShuffle"
            [hasBackdrop]="hasBackdrop || undefined">
  </b-avatar-showcase>
`;

const note = `
  ## Avatar Showcase (aka Employees Showcase)
  #### Module
  *EmployeesShowcaseModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [employees] | <s>AvatarShowcase[]</s> / SelectGroupOption[] | Employees list. \
  AvatarShowcase[] interface is deprecated\
   in favor of Select/list compatible SelectGroupOption[] (that can have badges &\
     icons in AvatarImage prefixcomponent object) | []
  [avatarSize] | AvatarSize | avatar size | 'mini'
  [min] | number | minimum number of avatars to show | 3
  [max] | number | maximum number of avatars to show \
  (values > 30 are not allowed and will be cut to 15). probably more aggressive limiting will boost overal page\
   performace. consider limiting to no more than 10 | 15
  [expandOnClick] | boolean | expands panel on click | true
  [showTotal] | boolean | show the total counter circle \
   - only valid for avatar size < medium; will be disabled if [fadeOut] is true) | true
  [showTotalLabel] | boolean | show total text ("X Employees") to the right of the showcase | false
  [inverseStack] | boolean | the 'front', uppermost avatar \
  will be on the left, and not on the right, as in defauult mode | false
  [fadeOut] | boolean | make avatars fade out, from front to back | false
  [zoomOnHover] | boolean | bring avatar to front and zoom on hover | false
  [readonly] | boolean | will display avatars select panel in readonly mode (no selection possible) | false
  [doShuffle] | boolean | shuffle avatars every 3 seconds (if total is more than fits) | false
  (selectChange) | EventEmitter<wbr>&lt;ListChange&gt; | list select change<br>\
  **Note** if there are no observers of (selectChange) event,\
   the select/list will be displayed in readonly mode  | &nbsp;
  (selectPanelOpened) | EventEmitter<wbr>&lt;void&gt; | emits when select panel opens (on showcase click) | &nbsp;
  (selectPanelClosed) | EventEmitter<wbr>&lt;void&gt; | emits when select panel closes | &nbsp;

  ~~~
  ${template1ForNotes}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Employees Showcase'" cdkScrollable class="content-wrapper" style="background: rgb(247,247,247); overflow: auto; max-height: 100vh; min-height: 0;">

<div style="max-width: 500px; text-align: left; min-height: 130vh;">
    ${template1}

    <hr style="margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">

    <h4>SelectGroupOption[] - AvtarImage component with badges; <br>
    avatarSize small, inverseStack, fadeOut, readonly</h4>
    ${template2}

    <h4>avatarSize mini, readonly</h4>
    ${template3}
</div>
</b-story-book-layout>
`;

story.add(
  'Avatar Showcase',
  () => {
    return {
      template: storyTemplate,
      props: {
        numOfMockAvatars: number(
          'number of mock avatars (0-30)',
          30,
          {},
          'Props'
        ),
        avatarSizes: AvatarSize,
        avatarSize: select(
          'avatarSize',
          sizeOptions,
          AvatarSize.medium,
          'Props'
        ),
        min: number('min', 1, {}, 'Props'),
        max: number('max', 5, {}, 'Props'),
        expandOnClick: boolean('expandOnClick', true, 'Props'),
        showTotal: boolean('showTotal', true, 'Props'),
        showTotalLabel: boolean('showTotalLabel', false, 'Props'),
        inverseStack: boolean('inverseStack', false, 'Props'),
        fadeOut: boolean('fadeOut', false, 'Props'),
        zoomOnHover: boolean('zoomOnHover', false, 'Props'),
        readonly: boolean('readonly', false, 'Props'),
        hasBackdrop: boolean('hasBackdrop', false, 'Props'),
        doShuffle: boolean('doShuffle', false, 'Props'),

        employees: object<AvatarShowcase[]>(
          'employees',
          cloneDeepSimpleObject(EMPLOYEE_SHOWCASE_MOCK),
          'Data'
        ),
        employeeOptions: object<SelectGroupOption>(
          'employeeOptions',
          cloneDeep(EMPLOYEE_SHOWCASE_OPTIONS_MOCK),
          'Data'
        ),
        clone: cloneDeepSimpleObject,

        selectChange: action('Showcase list change'),
        onAvatarClick: action('Avatar clicked'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          EmployeesShowcaseModule,
          ScrollingModule,
        ],
      },
    };
  },
  { notes: { markdown: note } }
);
