import { storiesOf } from '@storybook/angular';
import {
  boolean,
  select,
  text,
  withKnobs
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { values } from 'lodash';
import { AvatarSize } from './avatar.enum';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { AvatarModule } from './avatar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Icons, IconColor, IconSize } from '../../icons/icons.enum';
import { IconsModule } from '../../icons/icons.module';

const avatarStories = storiesOf(
  ComponentGroupType.ButtonsAndIndicators,
  module
).addDecorator(withKnobs);

const sizeOptions = values(AvatarSize);
const badges = [Icons.pending_badge, Icons.approve_badge];
const badgeColors = Object.keys(IconColor);

const template = `
<div style="display: flex; justify-content: center;">
<b-avatar
  [imageSource]="imageSource"
  [size]="size"
  [isClickable]="isClickable"
  [title]="title"
  [subtitle]="subtitle"
  [disabled]="disabled"
  [badge]="badge"
  (clicked)="clickHandler($event)">
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
  imageSource | string | URL of the avatar image |
  size | AvatarSize | enum for setting the avatar size | mini (optional)
  isClickable | boolean | can click avatar | false
  title | string | main title of the avatar | '' (optional)
  subtitle | string | subtitle of the avatar | '' (optional)
  disabled | boolean | disabled avatar | false (optional)
  badge | BadgeConfig | badge config: includes icon and color | undefined (optional)
  clicked | boolean | boolean flag for indicating if the avatar is clickable or not | false (optional)
  handleClick | Function | callback for clicking on the avatar | no click (optional)

  ~~~
  ${template}
  ~~~
`;

const storyTemplate = `
<b-story-book-layout [title]="'Avatar'">

<style>

  .upload-overlay {
    background-color: rgba(0, 0, 0, .4);
    color: white;
    pointer-events: none;
    justify-content: center;
    opacity: 1;
    transition: opacity 0.9s;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    text-align: center;
    background-size: initial;
    display: flex;
    align-items: center;
  }

</style>

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
        size: select('size', sizeOptions, AvatarSize.medium),
        isClickable: boolean('isClickable', false),
        clickHandler: action(),
        title: text('title', 'John Doe'),
        subtitle: text('subtitle', 'Web Developer'),
        disabled: boolean('disabled', false),
        badge: {
          icon: select('badge icon', badges, Icons.pending_badge),
          color: select('badge color', badgeColors, IconColor.primary)
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
