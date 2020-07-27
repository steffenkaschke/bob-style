import { storiesOf } from '@storybook/angular';
import { text, number, withKnobs } from '@storybook/addon-knobs/angular';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { RteViewModule } from '../../../../bob-rte/src/rte-view/rte-view.module';
import { ReadMoreModule } from './read-more.module';
import { APP_BASE_HREF } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RteViewComponent } from '../../../../bob-rte/src/rte-view/rte-view.component';

const rteMockHtml = `<div><span style="">Seville (Spanish: Sevilla) [16] is the capital of Andalucia and the cultural and financial centre of southern Spain. A city of just over 700,000 inhabitants (1.6 million in the metropolitan area, making it Spain's 4th largest city), Seville is Andalucia's top destination, with much to offer the traveler.</span></div> <div><a href="https://en.wikipedia.org/wiki/Metropol_Parasol" target="_blank" rel="noopener noreferrer">Metropol Parasol</a> is a wooden structure located at La Encarnación square, in the old quarter of Seville, Spain. It was designed by the German architect <a href="http://www.jmayerh.de/" target="_blank" rel="noopener noreferrer">Jürgen Mayer</a> and completed in April 2011.</div>`;

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);

const template1 = `<b-rich-text-view [type]="'shoutout'"
          [value]="rteMockHtml"
          [bReadMore]="maxLines">
</b-rich-text-view>`;

const templateForNotes = ``;

const storyTemplate = `
<b-story-book-layout [title]="'Read More Directive'">
<div style="max-width: 350px">
  ${template1}
</div>
</b-story-book-layout>
`;

const note = `
  ## Read More Directive
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
  'Read More Directive',
  () => {
    return {
      template: storyTemplate,
      props: {
        rteMockHtml: rteMockHtml,
        maxLines: number('maxLines', 5),
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
