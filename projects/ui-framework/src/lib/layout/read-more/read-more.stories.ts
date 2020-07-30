import { storiesOf } from '@storybook/angular';
import {
  text,
  number,
  withKnobs,
  boolean,
} from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { RteViewModule } from '../../../../bob-rte/src/rte-view/rte-view.module';
import { ReadMoreModule } from './read-more.module';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RteViewComponent } from '../../../../bob-rte/src/rte-view/rte-view.component';
import {
  makeArray,
  randomNumber,
  randomFromArray,
} from '../../services/utils/functional-utils';
import {
  mockText,
  mockLinkHtml,
  mockBadJobs,
  mockAnimals,
  mockThings,
} from '../../mock.const';
import { action } from '@storybook/addon-actions';

// const rteMockHtml =

const getMockHtml = () =>
  'Imagine ' +
  makeArray(randomNumber(10, 15))
    .map((_) => mockText(randomNumber(12, 20)))
    .reduce((str, i: string, ind) => {
      return (str +=
        i.toLowerCase() +
        randomFromArray([
          ` ${mockLinkHtml()}${randomFromArray([
            '. Luckily, ',
            '... <br>Also, ',
            '! And so, ',
          ])} `,
          ` <strong>${mockLinkHtml()}</strong>${randomFromArray([
            '! <br>Luckily, ',
            '. Also, ',
            '!!!! And so, ',
          ])} `,
          `. <br><span style="font-size: 18px">AND THEN HE</span> `,
          `. <br><span style="font-size: 18px">AND THEN HE</span> `,
          `. <br><span style="font-size: 18px"> UNFORTUNATELY, </span> `,
          `. <br><span style="font-size: 18px"> BUT!!! </span> `,
          ` <strong>${mockBadJobs(1)}</strong> `,
          ` <strong>${mockBadJobs(1)}</strong> `,
          ` <strong>${mockBadJobs(1)}</strong> `,
          ` <em><u>${mockAnimals(1)}</u></em> `,
          ` <em><u>${mockThings(1)}</u></em> `,
          ` <em><u>${mockThings(1)}</u></em> `,
        ]));
    }, '') +
  ' ' +
  mockText(randomNumber(3, 5)).toLowerCase() +
  ' and that was the #end';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template1 = `
<b-read-more [config]="{
  maxLines: maxLines,
  maxHeight: maxHeight,
  expandable: expandable,
  watchClicks: true,
  dynamicFontSize: true,
  readMoreButtonCss: {
    marginLeft: 'auto'
  }
}"
(clicked)="onClick($event)" [debug]="true">
<b-rich-text-view [type]="'shoutout'"
          [value]="rteMockHtml">
</b-rich-text-view>
</b-read-more>

<button (click)="rteMockHtml = getMockHtml()">new html</button>

<br><br>

<b-read-more [config]="{
  maxLines: maxLines,
  maxHeight: maxHeight,
  expandable: expandable,
  watchClicks: true,
  dynamicFontSize: false,
  readMoreButtonCss: {
    marginLeft: 'auto'
  }
}"
(clicked)="onClick($event)" [debug]="true">

<div class="b-big-body">
<p>This should not need read-more. ${mockText(90)}. #end</p>
</div>

</b-read-more>

<br><br>

<b-read-more [config]="{
  maxLines: 6,
  maxHeight: null,
  expandable: true,
  animateExpand: false,
  watchClicks: true,
  dynamicFontSize: false,
  readMoreButtonCss: {
    marginLeft: 'auto'
  }
}"
(clicked)="onClick($event)" [debug]="true">

<div class="b-big-body">
<p class="pad-t-8 pad-b-8">${mockText(190)}. #end</p>
</div>

</b-read-more>

`;

const templateForNotes = ``;

const storyTemplate = `
<b-story-book-layout [title]="'Read More'">
<div style="text-align:left">
  ${template1}
</div>
</b-story-book-layout>
`;

const note = `
  ## Read More
  #### Module
  *MasonryLayoutModule*

  ~~~
  ${template1}
  ~~~

  #### Properties
  Name | Type | Description
  --- | --- | ---



`;

story.add(
  'Read More',
  () => {
    return {
      template: storyTemplate,
      props: {
        rteMockHtml: getMockHtml(),
        getMockHtml: getMockHtml,
        expandable: boolean('expandable', false),
        maxLines: number('maxLines', 5),
        maxHeight: number('maxHeight', 300),
        onClick: action('click'),
      },
      moduleMetadata: {
        imports: [
          BrowserAnimationsModule,
          StoryBookLayoutModule,
          ReadMoreModule,
          RteViewModule,
          RouterModule.forRoot(
            [
              {
                path: '',
                component: RteViewComponent,
              },
              {
                path: 'employee-profile/:id',
                component: RteViewComponent,
              },
            ],
            { useHash: true }
          ),
        ],
        providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      },
    };
  },
  { notes: { markdown: note } }
);
