import { PERMISSIONS, entryPointUriPath } from './src/constants';

/**
 * @type {import('@commercetools-frontend/application-config').ConfigOptionsForCustomApplication}
 */
const config = {
  name: 'Custom Chatbot',
  entryPointUriPath,
  cloudIdentifier: 'gcp-au',
  headers: {
    csp: {
      'connect-src': ['${env:API_END_POINT}'],
    },
    permissionsPolicies: {
      microphone: "'self' https://jj-custom-chatbot.vercel.app/",
    },
  },
  env: {
    development: {
      initialProjectKey: 'ct-assessment',
    },
    production: {
      applicationId: '${env:APPLICATION_ID}',
      url: '${env:APP_URL}',
    },
  },
  oAuthScopes: {
    view: ['view_products'],
    manage: ['manage_products'],
  },
  icon: '${path:@commercetools-frontend/assets/application-icons/rocket.svg}',
  mainMenuLink: {
    defaultLabel: 'Template starter',
    labelAllLocales: [],
    permissions: [PERMISSIONS.View],
  },
  submenuLinks: [
    {
      uriPath: 'channels',
      defaultLabel: 'Channels',
      labelAllLocales: [],
      permissions: [PERMISSIONS.View],
    },
  ],
};

export default config;
