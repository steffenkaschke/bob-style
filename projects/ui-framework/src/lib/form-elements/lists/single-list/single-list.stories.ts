import { storiesOf } from '@storybook/angular';
import {
  select,
  withKnobs,
  object,
  text,
  number,
  boolean
} from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../../consts';
import { ButtonsModule } from '../../../buttons/buttons.module';
import { TypographyModule } from '../../../typography/typography.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../../story-book-layout/story-book-layout.module';
import { SingleListModule } from './single-list.module';
import { SelectGroupOption } from '../list.interface';
import { AvatarComponent } from '../../../avatar/avatar/avatar.component';
import { AvatarModule } from '../../../avatar/avatar/avatar.module';

const buttonStories = storiesOf(ComponentGroupType.Lists, module).addDecorator(
  withKnobs
);

const template = `
<b-single-list [options]="options"
               (selectChange)="selectChange($event)"
               [showSingleGroupHeader]="showSingleGroupHeader">
               <div single-list-footer style="display: flex; justify-content: flex-end; padding: 15px">
                 <b-text-button [text]="'Click Me!'" [color]="'primary'"> </b-text-button>
               </div>
</b-single-list>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Single list'">
  <div style="max-width: 350px;">
    ${template}
  </div>
</b-story-book-layout>
`;

const note = `
  ## Single list

  #### Module
  *SingleListModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [options] | SelectGroupOption[] | model of selection group | none
  [showSingleGroupHeader] | boolean | displays single group with group header | false
  [maxHeight] | number | component max height | 352 (8 rows)
  (selectChange) | EventEmitter&lt;ListChange&gt; | emits ListChange | none

  ~~~
  ${template}
  ~~~
`;

const groupNum = 3;
const optionsNum = 4;

const optionsMock: SelectGroupOption[] = Array.from(Array(groupNum), (_, i) => {
  return {
    groupName: `Basic Info G${i} - header`,
    options: Array.from(Array(optionsNum), (_, k) => {
      return {
        value: `Basic Info G${i}_E${k} - option`,
        id: i * optionsNum + k,
        selected: false,
        prefixComponent: {
          component: AvatarComponent,
          attributes: {
            imageSource:
              'https://pixel.nymag.com/imgs/daily/vulture/2017/03/23/23-han-solo.w330.h330.jpg'
          }
        }
      };
    })
  };
});

optionsMock[0].options[1].selected = true;

buttonStories.add(
  'Single list',
  () => ({
    template: storyTemplate,
    props: {
      selectChange: action('Single list change'),
      showSingleGroupHeader: boolean('showSingleGroupHeader', true),
      options: object<SelectGroupOption>('options', optionsMock)
    },
    moduleMetadata: {
      imports: [
        SingleListModule,
        ButtonsModule,
        TypographyModule,
        BrowserAnimationsModule,
        StoryBookLayoutModule,
        AvatarModule
      ],
      entryComponents: [AvatarComponent]
    }
  }),
  { notes: { markdown: note } }
);
