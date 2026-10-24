import type { Preview } from '@storybook/react-vite';
import { initialize, mswLoader } from 'msw-storybook-addon';

import { attachmentUrlHandlers } from '../src/test-utils/mocks/attachmentUrlHandlers';
import i18n from '../src/i18n';

import '../src/index.css';

initialize({ onUnhandledRequest: 'bypass' });

// Stories (and their text assertions) are written in English, whatever the browser language is.
i18n.changeLanguage('en');

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    },

    msw: {
      handlers: attachmentUrlHandlers,
    },
  },
  loaders: [mswLoader],
};

export default preview;
