import { prefixSuffixEnumValues } from '@useparagon/whiskers-core';

export enum SecretKeys {
  /**
   * Personal access token for the GitHub bot to use for interactions with
   * GitHub.
   */
  BOT_GITHUB_TOKEN = 'BOT_GITHUB_TOKEN',

  /**
   * npm auth token for the npm registry.
   */
  NPM_TOKEN = 'NPM_TOKEN',
}

export const Secrets = prefixSuffixEnumValues('secrets.', SecretKeys, '');
