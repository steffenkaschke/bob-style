import { storiesOf } from '@storybook/angular';
import { text, select, boolean, withKnobs, number } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { ProgressBarModule } from './progress-bar.module';
import { randomNumber, randomFromArray } from '../../services/utils/functional-utils';
import { ProgressBarType, ProgressBarSize } from './progress-bar.enum';
import { ColorService } from '../../services/color-service/color.service';
import { DividerModule } from '../../layout/divider/divider.module';
import { Icons } from '../../icons/icons.enum';
import { ButtonsModule } from '../../buttons/buttons.module';

const story = storiesOf(ComponentGroupType.Indicators, module).addDecorator(withKnobs);

const template = `
  <b-progress-bar [type]="type"
                  [size]="size"
                  [color]="color"
                  [value]="value"
                  [config]="{
                    disableAnimation: disableAnimation
                  }"
                  [data]="{
                    textHeaderLeft: textHeaderLeft,
                    textHeaderRight: textHeaderRight,
                    iconHeaderRight: iconHeaderRight
                  }">
  </b-progress-bar>
`;

const examples = `
<b-progress-bar [type]="'primary'"
                [size]="'large'"
                [color]="color1"
                [value]="value1"
                [config]="{
                  disableAnimation: disableAnimation
                }"
                [data]="{
                    textHeaderLeft: 'Primary large',
                    textHeaderRight: textRight1,
                    iconHeaderRight: icon1
                  }">
</b-progress-bar>

<br><br>

<b-progress-bar [type]="'primary'"
                [size]="'medium'"
                [color]="color2"
                [value]="value2"
                [config]="{
                  disableAnimation: disableAnimation
                }"
                [data]="{
                    textHeaderLeft: 'Primary medium',
                    textHeaderRight: textRight2,
                    iconHeaderRight: icon2
                  }">
</b-progress-bar>


`;

const template2 = `
  <b-progress-bar [type]="'secondary'"
                  [value]="value3"
                  [config]="{
                    disableAnimation: disableAnimation
                  }">
      <span header-left>
        <strong style="margin-right: 16px;">Secondary</strong> 1 size, 1 color
      </span>
  </b-progress-bar>
`;

const template3 = `
  <b-progress-bar [type]="'primary'"
                  [size]="'large'"
                  [color]="color4"
                  [value]="value4"
                  [config]="{
                    disableAnimation: disableAnimation
                  }">
      <span header-left>
       Can also transclude passed ng-content
      </span>
      <b-button header-right [type]="'secondary'" [size]="'small'" [text]="'Click me'"></b-button>
  </b-progress-bar>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Progress Bar'">
  <div>
    ${template}
    <hr style="margin: 60px 0 50px 0; border: 0; height: 0; border-top: 2px dashed #d2d2d2;">
    ${examples}
    <br><br>
    ${template3}
    <br><br>
    ${template2}
    <div style="margin-top: 100vh; padding-bottom: 100px;">
    <h3 style="text-align: left; margin-bottom: 50px;">Progress bars animate as they come in view</h3>
      ${examples}
    </div>
  </div>
</b-story-book-layout>
`;

const note = `
  ## Progress Bar
  #### Module
  *ProgressBarModule*

  #### Properties
  Name | Type | Description | Default value
  --- | --- | --- | ---
  [type] | ProgressBarType | theme | primary
  [size] | ProgressBarSize | theme size | medium
  [color]| string | bar color | &nbsp;
  [value] | number | progress value (0-100) |  &nbsp;
  [data] | ProgressBarData | \`\`\`textHeaderLeft: string\`\`\` - text for the left part of header,<br>\
   \`\`\`textHeaderRight: string\`\`\` - text for the right part of header,<br>\
    \`\`\`iconHeaderRight: Icons\`\`\` - icon for the right part of header |  &nbsp;
  [config] | ProgressBarConfig | \`\`\`disableAnimation: boolean\`\`\` - disables animation  |  &nbsp;
  &lt;elem header-left&gt; | ng-content | content for the left part of header | &nbsp;
  &lt;elem header-right&gt; | ng-content | content for the right part of header | &nbsp;

  ~~~
  ${template}
  ${template3}
  ~~~
`;

const icons = [
  Icons.calendar,
  Icons.chat,
  Icons.doc_add,
  Icons.doc_icon,
  Icons.email,
  Icons.harmonise,
  Icons.home_main,
  Icons.home,
  Icons.infinite,
  Icons.lock,
  Icons.megaphone,
  Icons.note,
  Icons.department_icon,
  Icons.person,
  Icons.person_check,
  Icons.print,
  Icons.success,
  Icons.tag
];

story.add(
  'Progress Bar',
  () => {
    return {
      template: storyTemplate,
      props: {
        color1: ColorService.prototype.randomColor(),
        color2: ColorService.prototype.randomColor(),
        color3: ColorService.prototype.randomColor(),
        color4: ColorService.prototype.randomColor(),
        color5: ColorService.prototype.randomColor(),

        value1: randomNumber(20, 80),
        value2: randomNumber(20, 80),
        value3: randomNumber(20, 80),
        value4: randomNumber(20, 80),
        value5: randomNumber(20, 80),

        textRight1: randomNumber(1, 20) + '/' + randomNumber(20, 30),
        textRight2: randomNumber(1, 20) + '/' + randomNumber(20, 30),
        textRight3: randomNumber(1, 20) + '/' + randomNumber(20, 30),

        icon1: randomFromArray(icons, 1),
        icon2: randomFromArray(icons, 1),
        icon3: randomFromArray(icons, 1),

        type: select('type', Object.values(ProgressBarType), ProgressBarType.primary),
        size: select('size', Object.values(ProgressBarSize), ProgressBarSize.medium),
        color: select('color', ['#9d9d9d', '#ff962b', '#f8bc20', '#17b456', '#e52c51', '#4b95ec'], '#17b456'),
        value: number('value', randomNumber(20, 80)),

        textHeaderLeft: text('textHeaderLeft', 'Make America great again!'),
        textHeaderRight: text('textHeaderRight', randomNumber(1, 20) + '/' + randomNumber(20, 30)),
        iconHeaderRight: select('iconHeaderRight', icons, Icons.doc_icon),
        disableAnimation: boolean('disableAnimation', false)
      },
      moduleMetadata: {
        imports: [StoryBookLayoutModule, ProgressBarModule, DividerModule, ButtonsModule]
      }
    };
  },
  { notes: { markdown: note } }
);
