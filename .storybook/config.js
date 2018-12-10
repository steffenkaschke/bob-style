import { configure, addDecorator } from '@storybook/angular';
import { withOptions } from '@storybook/addon-options';
import '!style-loader!css-loader!sass-loader!../projects/ui-framework/src/lib/style/theme.scss';

addDecorator(
  withOptions({
    name: 'bob ui framework',
    url: 'https://github.com/hibobio/bob-style',
    hierarchyRootSeparator: /\|/
  })
)

// automatically import all files ending in *.stories.ts
const req = require.context('../projects/ui-framework', true, /.stories.ts$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
