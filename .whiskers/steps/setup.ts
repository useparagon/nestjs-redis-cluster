import { CheckoutParams, GitCheckoutWorkflowStep } from '@useparagon/whiskers-cattery-git';
import { SetupNodeWorkflowStep } from '@useparagon/whiskers-cattery-node';
import { GithubActionWorkflowStep, ShellStepConfig } from '@useparagon/whiskers-core';

export function setupSteps(params: CheckoutParams = {}): GithubActionWorkflowStep<any>[] {
  return [
    new GitCheckoutWorkflowStep({
      name: 'git > checkout',
      with: params,
    }),
    new SetupNodeWorkflowStep({
      name: 'node > setup',
      with: {
        'node-version-file': '.nvmrc',
        cache: 'yarn',
      },
    }),
    new GithubActionWorkflowStep<ShellStepConfig>({
      name: 'yarn > install',
      run: 'yarn install --frozen-lockfile',
    }),
  ];
}
