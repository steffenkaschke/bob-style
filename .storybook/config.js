import { configure } from '@storybook/angular';
import { setOptions } from '@storybook/addon-options';
import '!style-loader!css-loader!../src/style.css';

setOptions({
  hierarchyRootSeparator: /\|/,
  name: 'bob style guide'
});

//automatically import all files ending in *.stories.ts
const req = require.context('../src', true, /.stories.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);