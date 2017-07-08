import { GitHubRef } from "./github-ref";
import { RepositoryRef } from "./repository-ref";

export class IssueRef extends GitHubRef {
  public readonly repository: RepositoryRef;
  public readonly number: number;

  protected constructor(repository: RepositoryRef, issueNumber: number) {
    super(repository);
    this.repository = repository;
    this.number = issueNumber;
  }
}

export class IssueRefCreator extends IssueRef {
  private constructor(repository: RepositoryRef, issueNumber: number) {
    super(repository, issueNumber);
  }

  public static create(repository: RepositoryRef, issueNumber: number) {
    return new IssueRefCreator(repository, issueNumber);
    //return new IssueRef(repository, issueNumber);
  }
}
