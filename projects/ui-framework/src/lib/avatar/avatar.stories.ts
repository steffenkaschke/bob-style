import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, boolean, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { AvatarComponent, AvatarSize } from './avatar.component';
import { values } from 'lodash';

const avatarStories = storiesOf('Buttons & Indicators', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const sizeOptions = values(AvatarSize);
const note = `
  ## Avatar Element
  ##### Basic component for display image avatar

  Name | Type | Description | Default value
  --- | --- | --- | ---
  imageSource | String | url of the image |
  size | AvatarSize | enum for setting the avatar size | mini (optional)
  isClickable | Boolean | boolean flag for indicating if the avatar is clickable or not | false (optional)
  handleClick | Function | callback for clicking on the avatar | no click (optional)

  ~~~
  <b-avatar
    [imageSource] = "imageUrl"
    [size] = "medium"
    [isClickable] = "false"
    (handleClick) = "clickHandler()">
  </b-avatar>
  ~~~
`;
avatarStories.add(
    'Avatar',
    () => {
      return {
        component: AvatarComponent,
        props: {
          imageSource: text('imageSource', 'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg'),
          size: select('size', sizeOptions, AvatarSize.small),
          isClickable: boolean('isClickable', false),
          handleClick: action()
        }
      };
    },
    { notes: { markdown: note }  }
  );

