import { configure, addDecorator } from '@storybook/angular';
import { withOptions } from '@storybook/addon-options';
import '!style-loader!css-loader!../style.css';

addDecorator(
  withOptions({
    name: 'bob ui framework',
    hierarchyRootSeparator: /\|/,
  })
)

// automatically import all files ending in *.stories.ts
const req = require.context('../projects/ui-framework', true, /.stories.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
