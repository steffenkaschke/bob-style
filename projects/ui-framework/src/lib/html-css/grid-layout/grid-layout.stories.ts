import { storiesOf } from '@storybook/angular';
import { withKnobs, select, boolean } from '@storybook/addon-knobs/angular';
import { action } from '@storybook/addon-actions';
import { ComponentGroupType } from '../../consts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoryBookLayoutModule } from '../../story-book-layout/story-book-layout.module';
import { TypographyModule } from '../../typography/typography.module';
import { GridLayoutExampleModule } from './grid-layout-example.module';
import { GridItemClass, GridContainerClass } from './grid-layout.enum';

const story = storiesOf(ComponentGroupType.Layout, module).addDecorator(
  withKnobs
);
const story2 = storiesOf(ComponentGroupType.HtmlCss, module).addDecorator(
  withKnobs
);

const template = `
<b-grid-layout-example
[containerClass]="containerClass"
[itemsClasses]="[
  element1class + (element1break ? ' new-row-after' : '') + (element1newRow ? ' new-row-start' : ''),
  element2class + (element2break ? ' new-row-after' : '') + (element2newRow ? ' new-row-start' : ''),
  element3class + (element3break ? ' new-row-after' : '') + (element3newRow ? ' new-row-start' : ''),
  element4class + (element4break ? ' new-row-after' : '') + (element4newRow ? ' new-row-start' : ''),
  element5class + (element5break ? ' new-row-after' : '') + (element5newRow ? ' new-row-start' : ''),
  element6class + (element6break ? ' new-row-after' : '') + (element6newRow ? ' new-row-start' : '')
]"

></b-grid-layout-example>
`;

const storyTemplate = `
<b-story-book-layout [title]="'Grid layout example'">
  <div style="max-width: none;">${template}</div>
</b-story-book-layout>
`;

const note = `
  ## Grid Layout

~~~
<div class="grid-layout-12-cols row-gap">

    <div class="col-2-thirds"> 2/3 </div>
    <div class="col-third"> 1/3 </div>

    <div class="col-quarter"> 1/4 </div>
    <div class="col-3-quarters"> 3/4 </div>

    <div class="col-half"> 1/2 </div>
    <div class="col-half"> 1/2 </div>

</div>
~~~

~~~
<div class="grid-layout-12-cols">

    <div class="col-sm-8 col-md-6 col-lg-3"> some thing </div>
    <div class="col-sm-4 col-md-6 col-lg-3"> other thing </div>

</div>
~~~

  #### Classes Enums
  Classnames also available as enums: \`GridContainerClass\` & \`GridItemClass\`;

  #### Container classes
  By default, container with class \`grid-layout-12-cols\` has column-gap (spacing between columns) of 24px.

  Name | Description
  --- | ---
  grid-layout-12-cols | Container should always have this class.
  &nbsp; | &nbsp;
  row-gap | Adds row-gap (spacing between rows) of 24px
  no-row-gap | Removes row-gap (spacing between rows)
  no-col-gap | Removes column-gap (spacing between columns)
  no-gap | Removes all gaps
  &nbsp; | &nbsp;

  #### Column classes
  By default, a child of \`grid-layout-12-cols\`, without extra classes, takes full width of container.

  Name | Description
  --- | ---
  col-1... col-12 | Sets column width to 1/12 to 12/12 of container width
  col-sm-1... col-sm-12 | Sets column width to 1/12 to 12/12 of container width - when the screen width is &gt;=768px.<br>\
  Below 768px, the column will be full width by default (unless col-X class is applied).
  col-md-1... col-md-12 | Sets column width to 1/12 to 12/12 of container width - when the screen width is &gt;=992px.<br>\
  Below 992px, the column will be full width by default (unless col-X or col-sm-X class is applied).
  col-lg-1... col-lg-12 | Sets column width to 1/12 to 12/12 of container width - when the screen width is &gt;=1200px.<br>\
  Below 1200px, the column will be full width by default (unless col-X, col-md-X or col-sm-X class is applied).
  &nbsp; | &nbsp;
  col-quarter | same as \`col-3\` (1/3 width)
  col-third | same as \`col-4\` (1/3 width)
  col-half | same as \`col-6\` (1/2 width)
  col-2-thirds | same as \`col-8\` (2/3 width)
  col-3-quarters | same as \`col-9\` (3/4 width)
  col-full | same as \`col-12\` (full width)
  &nbsp; | &nbsp;
  new-row-start | element with this class will create a new row (will start from new line)
  &nbsp; | &nbsp;
`;
//   new-row-after | add this class to force new row (line break) <i>after</i> this element

const colClasses = [
  'col-1',
  'col-2',
  'col-3',
  'col-4',
  'col-5',
  'col-6',
  'col-7',
  'col-8',
  'col-9',
  'col-10',
  'col-11',
  'col-12',
  ...Object.values(GridItemClass),
];

const colClassDef = GridItemClass.third;

const containerClasses = [
  '',
  ...Object.values(GridContainerClass).filter(
    i => i !== GridContainerClass.container
  ),
];

const toAdd = () => {
  return {
    template: storyTemplate,
    props: {
      containerClass: select('Container class', containerClasses, 'row-gap'),

      element1class: select(
        'Elem 1 class',
        colClasses,
        GridItemClass.twoThirds
      ),
      // element1break: boolean('Elem 1 new-row-after', false),
      element1newRow: boolean('Elem 1 new-row-start', false),

      element2class: select('Elem 2 class', colClasses, GridItemClass.third),
      // element2break: boolean('Elem 2 new-row-after', false),
      element2newRow: boolean('Elem 2 new-row-start', false),

      element3class: select('Elem 3 class', colClasses, GridItemClass.quarter),
      // element3break: boolean('Elem 3 new-row-after', false),
      element3newRow: boolean('Elem 3 new-row-start', false),

      element4class: select(
        'Elem 4 class',
        colClasses,
        GridItemClass.threeQuarters
      ),
      // element4break: boolean('Elem 4 new-row-after', false),
      element4newRow: boolean('Elem 4 new-row-start', false),

      element5class: select('Elem 5 class', colClasses, GridItemClass.half),
      // element5break: boolean('Elem 5 new-row-after', false),
      element5newRow: boolean('Elem 5 new-row-start', false),

      element6class: select('Elem 6 class', colClasses, GridItemClass.half),
      // element6break: boolean('Elem 6 new-row-after', false),
      element6newRow: boolean('Elem 6 new-row-start', false),
    },
    moduleMetadata: {
      imports: [
        BrowserAnimationsModule,
        TypographyModule,
        StoryBookLayoutModule,
        GridLayoutExampleModule,
      ],
    },
  };
};

story.add('Grid Layout', toAdd, { notes: { markdown: note } });

story2.add('Grid Layout', toAdd, { notes: { markdown: note } });
