import {
  GithubActionWorkflow,
  GithubActionWorkflowJob,
  GithubActionWorkflowStep,
  ActionsStepConfig,
  ShellStepConfig,
} from '@useparagon/whiskers-core';
import { VerifyWorkflowSuccessGithubActionWorkflowJob } from '@useparagon/whiskers-cattery-github';

import { setupSteps } from '../steps/setup';

const JOB_ID_BUILD = 'build';
const JOB_ID_LINT = 'lint';

export default new GithubActionWorkflow({
  name: 'build',
  on: {
    pull_request: {},
    push: {
      branches: ['master'],
    },
  },
  jobs: [
    new GithubActionWorkflowJob({
      id: JOB_ID_BUILD,
      name: 'build',
      steps: [
        ...setupSteps(),
        new GithubActionWorkflowStep<ShellStepConfig>({
          name: 'yarn > build',
          run: 'yarn build',
          env: {
            NODE_ENV: 'production',
          },
        }),
        new GithubActionWorkflowStep<ActionsStepConfig<any>>({
          name: 'ci > upload artifacts',
          uses: 'actions/upload-artifact@65462800fd760344b1a7b4382951275a0abb4808', // v4.3.3
          with: {
            name: 'dist',
            path: 'dist/',
            'if-no-files-found': 'error',
          },
        }),
      ],
    }),
    new GithubActionWorkflowJob({
      id: JOB_ID_LINT,
      name: 'lint',
      steps: [
        ...setupSteps(),
        new GithubActionWorkflowStep({
          name: 'yarn > lint',
          run: 'yarn lint',
        }),
      ],
    }),
    new VerifyWorkflowSuccessGithubActionWorkflowJob({
      BUILD: JOB_ID_BUILD,
      LINT: JOB_ID_LINT,
    }),
  ],
});
