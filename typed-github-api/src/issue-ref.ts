import { GitHubRef } from "./github-ref";
import { RepositoryRefClass } from "./repository-ref";

import { Issue, IssueRef } from "./interfaces/issue";
import { Repository, RepositoryRef } from "./interfaces/repository";


export class IssueRefClass extends GitHubRef implements IssueRef {
  public readonly repository: RepositoryRef;
  public readonly number: number;

  public constructor(repository: RepositoryRefClass, issueNumber: number) {
    super(repository);
    this.repository = repository;
    this.number = issueNumber;
  }

  public loadAsync(): Promise<Issue | null> {
    throw new Error("Method not implemented.");
  }

  public async loadRepositoryAsync(): Promise<Repository> {
    const response = await this.repository.loadAsync();
    if (response === null)
      throw new Error("Could not load repository; issue may not exist");
    return response;
  }
}
