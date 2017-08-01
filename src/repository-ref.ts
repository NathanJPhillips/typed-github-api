import * as moment from "moment";

import { CommitRefClass } from "./commit-ref";
import { GitHubRef } from "./github-ref";
import { IssueRefClass } from "./issue-ref";
import { OrganizationRefClass } from "./organization-ref";
import { PullRequestRefClass } from "./pull-request-ref";
import { UserRefClass } from "./user-ref";

import { CommitRef, CommitSummary } from "./interfaces/commit";
import { Issue, IssueRef } from "./interfaces/issue";
import { OrganizationRef } from "./interfaces/organization";
import { PullRequest, PullRequestRef } from "./interfaces/pull-request";
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

  public getPullRequest(pullRequestNumber: number): PullRequestRef {
    return new PullRequestRefClass(this, pullRequestNumber);
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
    _milestone?: number | "*" | "none",
    _state?: "open" | "closed" | "all",
    _assignee?: string,
    _creator?: string,
    _mentioned?: string,
    _labels?: string[],
    _sort?: "created" | "updated" | "comments",
    _ascending?: boolean,
    _updatedSince?: moment.Moment): Promise<Issue[]>
  {
    throw new Error("Method not implemented.");
  }

  public loadPullRequestsAsync(
    _state?: "open" | "closed" | "all",
    _headBranch?: string,
    _headUsersFork?: string,
    _baseBranch?: string,
    _sort?: "created" | "updated" | "popularity" | "long-running",
    _ascending?: boolean): Promise<PullRequest[]>
  {
    throw new Error("Method not implemented.");
  }
}
