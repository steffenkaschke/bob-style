import { storiesOf } from '@storybook/angular';
import { withNotes } from '@storybook/addon-notes';
import { text, select, withKnobs } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { AvatarComponent } from './avatar.component';

const avatarStories = storiesOf('Buttons & Indicators|Avatar', module)
  .addDecorator(withNotes)
  .addDecorator(withKnobs);

const note = `
  # hi
  ~~~~
  <b-avatar></b-avatar>
  ~~~~
`;
avatarStories.add(
    'Not Clickable',
    () => {
      return {
        component: AvatarComponent,
        props: {
          imageSource: text('imageSource', 'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg'),
          size: select('size', ['mini', 'small', 'medium', 'large'], 'small')
        }
      };
    },
    { notes: { markdown: note }  }
  )
  .add(
    'Clickable',
    () => ({
      component: AvatarComponent,
        props: {
          imageSource: text('imageSource', 'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg'),
          size: select('size', ['mini', 'small', 'medium', 'large'], 'small'),
          handleClick: action('log 1'),
        },
    }),
    { notes: `` }
  );

