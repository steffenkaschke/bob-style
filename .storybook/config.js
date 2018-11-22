import { configure } from '@storybook/angular';
import { setOptions } from '@storybook/addon-options';
import '!style-loader!css-loader!../style.css';

setOptions({
  hierarchyRootSeparator: /\|/,
  name: 'bob style guide'
});

//automatically import all files ending in *.stories.ts
const req = require.context('../projects/bob-ui-framework', true, /.stories.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);