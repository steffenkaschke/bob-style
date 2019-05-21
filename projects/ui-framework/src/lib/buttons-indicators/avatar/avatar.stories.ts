import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { zipObject } from 'lodash';
import { AvatarSize, AvatarBadge } from './avatar.enum';
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

const badges = Object.keys(AvatarBadge);
const chips = Object.keys(ChipType);

const template = `
<div style="display: flex; justify-content: center;">
<b-avatar
  [imageSource]="imageSource"
  [backgroundColor]="backgroundColor"
  [size]="size"
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
  size | AvatarSize | enum for setting the avatar size | mini (optional)
  isClickable | boolean | flag for indicating if the avatar is clickable or not | false
  title | string | main title of the avatar | none (optional)
  subtitle | string | subtitle of the avatar | none (optional)
  disabled | boolean | disabled avatar | false (optional)
  badge | BadgeConfig | badge config: includes icon and color | undefined (optional)
  clicked | Function | callback for clicking on the avatar | none
  backgroundColor | string | background color | none
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
