import { GitHubRef } from "./github-ref";
import { RepositoryRefClass } from "./repository-ref";

import { PullRequest, PullRequestRef } from "./interfaces/pull-request";
import { RepositoryRef } from "./interfaces/repository";


export class PullRequestRefClass extends GitHubRef implements PullRequestRef {
  public readonly repository: RepositoryRef;
  public readonly number: number;

  public constructor(repository: RepositoryRefClass, pullRequestNumber: number) {
    super(repository);
    this.repository = repository;
    this.number = pullRequestNumber;
  }

  public loadAsync(): Promise<PullRequest | null> {
    throw new Error("Method not implemented.");
  }
}
