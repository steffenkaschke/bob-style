import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { zipObject } from 'lodash';
import { AvatarSize, AvatarBadge, AvatarOrientation } from './avatar.enum';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { AvatarModule } from './avatar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Icons, IconColor } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';
import { ChipType } from '../chips/chips.enum';

const avatarStories = storiesOf(
  ComponentGroupType.ButtonsAndIndicators,
  module
).addDecorator(withKnobs);

const sizeOptionsKeys = Object.values(AvatarSize).filter(
  key => typeof key === 'string'
) as string[];
const sizeOptionsValues = Object.values(AvatarSize).filter(
  key => typeof key === 'number'
) as number[];
const sizeOptions = zipObject(sizeOptionsKeys, sizeOptionsValues);

const orientationOptions = Object.keys(AvatarOrientation);
const badges = Object.keys(AvatarBadge);
const chips = Object.keys(ChipType);

const template = `
<div style="display: flex; justify-content: center;">
<b-avatar
  [imageSource]="imageSource"
  [backgroundColor]="backgroundColor"
  [size]="size"
  [orientation]="orientation"
  [title]="title"
  [subtitle]="subtitle"
  [department]="department"
  [badge]="badge"
  [status]="status"
  [isClickable]="isClickable"
  [disabled]="disabled"
  (clicked)="clickHandler($event)"
  >
</b-avatar>
</div>
`;

const note = `
  ## Avatar Element
  #### Module
  *AvatarModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  imageSource | string | URL of the avatar image | none
  backgroundColor | string | background color | none
  size | AvatarSize | enum for setting the avatar size | mini
  orientation | AvatarOrientation | vertical or horizontal | horizontal
  title | string | main title of the avatar | none
  subtitle | string | subtitle of the avatar | none
  department | string | department & site | none
  badge | AvatarBadge | approved, pending or rejected | none
  status | Chip | object describing the status chip (should have type & text properties) | none
  disabled | boolean | disabled avatar | false
  isClickable | boolean | flag for indicating if the avatar is clickable or not | false
  clicked | Function | callback for clicking on the avatar | none

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Avatar'">
  ${template}
</b-story-book-layout>
`;

avatarStories.add(
  'Avatar',
  () => {
    return {
      template: storyTemplate,
      props: {
        imageSource: text(
          'imageSource',
          'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg'
        ),
        size: select('size', sizeOptions, AvatarSize.large),
        orientation: select(
          'orientation',
          orientationOptions,
          AvatarOrientation.horizontal
        ),
        isClickable: boolean('isClickable', false),
        clickHandler: action('Avatar Clicked'),
        title: text('title', 'John Doe'),
        subtitle: text('subtitle', 'Web Developer'),
        department: text('department', 'Product, Israel'),
        disabled: boolean('disabled', false),
        badge: select('badge', badges, AvatarBadge.approved),
        backgroundColor: select('background color', ['#fff', 'red', 'black']),
        status: {
          type: select('status type', chips, ChipType.success),
          text: text('status text', 'Employed')
        }
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          AvatarModule,
          IconsModule
        ]
      }
    };
  },
  { notes: { markdown: note } }
);
