import { GitHubRef } from "./github-ref";
import { RepositoryRefClass } from "./repository-ref";

import { Issue, IssueRef } from "./interfaces/issue";
import { RepositoryRef } from "./interfaces/repository";


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
}
