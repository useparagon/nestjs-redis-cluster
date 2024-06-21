import {
  ActionsStepConfig,
  GithubActionWorkflow,
  GithubActionWorkflowJob,
  GithubActionWorkflowStep,
  wrap,
} from '@useparagon/whiskers-core';

import { GitCheckoutWorkflowStep } from '@useparagon/whiskers-cattery-git';

import { ReleaseTypes } from '../types/releases';
import { Secrets } from '../types/secrets';

export default new GithubActionWorkflow({
  name: 'release',
  on: {
    push: {
      tags: ['v*.*.*'],
    },
  },
  jobs: [
    new GithubActionWorkflowJob({
      name: 'release',
      'timeout-minutes': 10,
      steps: [
        new GitCheckoutWorkflowStep({
          name: 'git > checkout',
          with: {
            token: wrap(Secrets.BOT_GITHUB_TOKEN),
          },
        }),
        new GithubActionWorkflowStep<ActionsStepConfig<any>>({
          name: 'release > create github release',
          uses: 'softprops/action-gh-release@de2c0eb89ae2a093876385947365aca7b0e5f844', // v0.1.15
          with: {
            token: wrap(Secrets.BOT_GITHUB_TOKEN),
            generate_release_notes: true,
            prerelease: wrap(`contains(github.ref, '${ReleaseTypes.experimental}')`),
          },
        }),
      ],
    }),
  ],
});
