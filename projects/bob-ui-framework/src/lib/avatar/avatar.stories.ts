import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { AvatarComponent } from './avatar.component';

const avatarStories = storiesOf('Buttons & Indicators|Avatar', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const md = `
  # hi
  ~~~~
  <b-avatar></b-avatar>
  ~~~~
`;
avatarStories.add(
    'Not Clickable',
    () => {
      const imageSource = text('imageSource', 'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg');
      const size = select('size', ['mini', 'small', 'medium', 'large'], 'small');

      return {
        component: AvatarComponent,
        props: {
          imageSource,
          size
        },
      };
    },
    { notes: { markdown: md }  }
  )
  .add(
    'Clickable',
    () => {
      const imageSource = text('imageSource', 'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg');
      const size = select('size', ['mini', 'small', 'medium', 'large'], 'small');

      return {
        component: AvatarComponent,
        props: {
          imageSource,
          size,
          onClick: action('log 1'),
        },
      };
    },
    { notes: `` }
  );

