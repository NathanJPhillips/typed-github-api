import { GitHubRef } from "./github-ref";
import { IssueRef, IssueRefCreator } from "./issue-ref";
import { UserRef } from "./user-ref";
import { OrganizationRef } from "./organization-ref";

export class RepositoryRef extends GitHubRef {
  public readonly owner: UserRef | OrganizationRef;
  public readonly name: string;

  protected constructor(owner: UserRef | OrganizationRef, name: string) {
    super(owner);
    this.owner = owner;
    this.name = name;
  }

  public getIssue(issueNumber: number): IssueRef {
    return IssueRefCreator.create(this, issueNumber);
  }
}

export class RepositoryRefCreator extends RepositoryRef {
  private constructor(owner: UserRef | OrganizationRef, name: string) {
    super(owner, name);
  }

  public static create(owner: UserRef | OrganizationRef, name: string) {
    return new RepositoryRefCreator(owner, name);
    //return new RepositoryRef(owner, name);
  }
}
