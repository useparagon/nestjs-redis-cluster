import {
  ActionsStepConfig,
  GithubActionWorkflow,
  GithubActionWorkflowJob,
  GithubActionWorkflowStep,
  ShellStepConfig,
  prefixSuffixEnumValues,
  wrap,
} from '@useparagon/whiskers-core';

import { setupSteps } from '../steps/setup';
import { ReleaseTypes } from '../types/releases';
import { Secrets } from '../types/secrets';

enum InputKeys {
  BRANCH = 'branch',
  RELEASE_TYPE = 'release_type',
  VERSION = 'version',
}

const Inputs = prefixSuffixEnumValues('inputs.', InputKeys, '');

const versionBumpJob = new GithubActionWorkflowJob({
  name: 'version bump',
  'timeout-minutes': 5,
  steps: [
    ...setupSteps({
      token: wrap(Secrets.BOT_GITHUB_TOKEN),
      ref: wrap(Inputs.BRANCH),
    }),
    new GithubActionWorkflowStep<ShellStepConfig>({
      name: 'yarn > bump version',
      run: `yarn run release:version:bump ${wrap(Inputs.VERSION)}`,
    }),
    new GithubActionWorkflowStep<ActionsStepConfig<any>>({
      name: 'git > commit version bump',
      uses: 'EndBug/add-and-commit@1bad3abcf0d6ec49a5857d124b0bfb52dc7bb081', // v9.1.3
      with: {
        default_author: 'github_actions',
        message: `bump version to ${wrap(Inputs.VERSION)}`,
        push: true,
        tag: `v${wrap(Inputs.VERSION)}`,
      },
    }),
  ],
});

const publishJob = new GithubActionWorkflowJob({
  name: 'publish',
  needs: [versionBumpJob.id],
  steps: [
    ...setupSteps({
      token: wrap(Secrets.BOT_GITHUB_TOKEN),
      ref: `v${wrap(Inputs.VERSION)}`,
    }),
    new GithubActionWorkflowStep<ActionsStepConfig<any>>({
      name: 'ci > download artifacts',
      uses:
        'dawidd6/action-download-artifact@268677152d06ba59fcec7a7f0b5d961b6ccd7e1e', // v2.28.0
      with: {
        workflow: 'build.yaml',
        workflow_conclusion: 'success',
        branch: wrap(Inputs.BRANCH),
      },
    }),
    new GithubActionWorkflowStep<ShellStepConfig>({
      name: `yarn > publish (${ReleaseTypes.experimental})`,
      if: `${Inputs.RELEASE_TYPE} == '${ReleaseTypes.experimental}'`,
      run: `yarn run release:publish:${ReleaseTypes.experimental}`,
      env: {
        NPM_AUTH_TOKEN: wrap(Secrets.NPM_TOKEN),
      },
    }),
    new GithubActionWorkflowStep<ShellStepConfig>({
      name: `yarn > publish (${ReleaseTypes.stable})`,
      if: `${Inputs.RELEASE_TYPE} == '${ReleaseTypes.stable}'`,
      run: `yarn run release:publish:${ReleaseTypes.stable}`,
      env: {
        NPM_AUTH_TOKEN: wrap(Secrets.NPM_TOKEN),
      },
    }),
  ],
});

export default new GithubActionWorkflow({
  name: 'publish',
  'run-name': `publish v${wrap(Inputs.VERSION)}`,
  on: {
    workflow_dispatch: {
      inputs: {
        [InputKeys.BRANCH]: {
          description:
            'The branch of the build. Used to find artifacts and tag.',
          required: true,
        },
        [InputKeys.RELEASE_TYPE]: {
          description: 'The type of release.',
          required: true,
          type: 'choice',
          options: Object.values(ReleaseTypes),
          default: ReleaseTypes.experimental,
        },
        [InputKeys.VERSION]: {
          description:
            "The version of this release. Omit 'v' prefix. Example: '1.0.1-experimental.1'.",
          required: true,
        },
      },
    },
  },
  jobs: [versionBumpJob, publishJob],
});
