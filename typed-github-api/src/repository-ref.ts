import * as moment from "moment";

import { BranchRefClass } from "./branch-ref";
import { CommitRefClass } from "./commit-ref";
import { GitHubRef } from "./github-ref";
import { IssueRefClass } from "./issue-ref";
import { OwnerRefClass } from "./owner-ref";
import { PullRequestRefClass } from "./pull-request-ref";

import { BranchRef } from "./interfaces/branch";
import { CommitRef, CommitSummary } from "./interfaces/commit";
import { Issue, IssueRef } from "./interfaces/issue";
import { OwnerRef } from "./interfaces/owner-ref";
import { PullRequest, PullRequestRef } from "./interfaces/pull-request";
import { Repository, RepositoryRef } from "./interfaces/repository";


export class RepositoryRefClass extends GitHubRef implements RepositoryRef {
  public readonly owner: OwnerRef;
  public readonly name: string;

  public constructor(owner: OwnerRefClass, name: string) {
    super(owner);
    this.owner = owner;
    this.name = name;
  }

  public getBranch(name: string): BranchRef {
    return new BranchRefClass(this, name);
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

  public loadBranchesAsync(_protectedOnly: boolean = false): Promise<BranchRef[]> {
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
