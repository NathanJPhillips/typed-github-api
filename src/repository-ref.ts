import * as moment from "moment";

import { CommitRefClass } from "./commit-ref";
import { GitHubRef } from "./github-ref";
import { IssueRefClass } from "./issue-ref";
import { OrganizationRefClass } from "./organization-ref";
import { UserRefClass } from "./user-ref";

import { CommitRef, CommitSummary } from "./interfaces/commit";
import { Issue, IssueRef } from "./interfaces/issue";
import { OrganizationRef } from "./interfaces/organization";
import { Repository, RepositoryRef } from "./interfaces/repository";
import { UserRef } from "./interfaces/user";


export class RepositoryRefClass extends GitHubRef implements RepositoryRef {
  public readonly owner: UserRef | OrganizationRef;
  public readonly name: string;

  public constructor(owner: UserRefClass | OrganizationRefClass, name: string) {
    super(owner);
    this.owner = owner;
    this.name = name;
  }

  public getCommit(sha: string): CommitRef {
    return new CommitRefClass(this, sha);
  }

  public getIssue(issueNumber: number): IssueRef {
    return new IssueRefClass(this, issueNumber);
  }

  public loadAsync(): Promise<Repository | null> {
    throw new Error("Method not implemented.");
  }

  public loadCommitsAsync(
    _start: string = "master",
    _pathIncluded?: string,
    _author?: string,
    _since?: moment.Moment,
    _until?: moment.Moment): Promise<CommitSummary[]>
  {
    throw new Error("Method not implemented.");
  }

  public loadIssuesAsync(
    _milestone?: number | "*" | "none" | undefined,
    _state?: "open" | "closed" | "all" | undefined,
    _assignee?: string | undefined,
    _creator?: string | undefined,
    _mentioned?: string | undefined,
    _labels?: string[] | undefined,
    _sort?: "created" | "updated" | "comments" | undefined,
    _ascending?: boolean | undefined,
    _updatedSince?: moment.Moment | undefined): Promise<Issue[]>
  {
    throw new Error("Method not implemented.");
  }
}
