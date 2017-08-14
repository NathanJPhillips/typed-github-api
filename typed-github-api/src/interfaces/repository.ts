import * as moment from "moment";

import { BranchRef } from "./branch";
import { CommitRef, CommitSummary } from "./commit";
import { Issue, IssueRef } from "./issue";
import { OwnerRef } from "./owner-ref";
import { PullRequest, PullRequestRef } from "./pull-request";
import { UserSummary } from "./user";

export interface RepositoryRef {
  readonly owner: OwnerRef;
  readonly name: string;

  getBranch(name: string): BranchRef;
  getCommit(sha: string): CommitRef;
  getIssue(issueNumber: number): IssueRef;
  getPullRequest(pullRequestNumber: number): PullRequestRef;

  loadAsync(): Promise<Repository | null>;

  /**
   * Loads branches from this repository.
   * @param protectedOnly Only loads protected branches
   * @returns             The resulting array of branches
   */
  loadBranchesAsync(protectedOnly?: boolean): Promise<BranchRef[]>;

  /**
   * Loads commits from this repository.
   * @param start         SHA or branch to start listing commits from. Default: the repository’s default branch (usually master)
   * @param pathIncluded  Only commits containing this file path will be returned
   * @param author        GitHub login or email address by which to filter by commit author
   * @param since         Only commits after this date will be returned
   * @param until         Only commits before this date will be returned
   * @returns             The resulting array of commits
   */
  loadCommitsAsync(
    start?: string,
    pathIncluded?: string,
    author?: string,
    since?: moment.Moment,
    until?: moment.Moment): Promise<CommitSummary[]>;

  /**
   * Loads issues for this repository.
   * @param milestone     Only loads issues for this milestone, if specified;
   *                      specify * to say the issue must be in a milestone and none to say it must not;
   *                      if a number is passed, it should refer to a milestone by its number field
   * @param state         Only loads issues for this state (default open)
   * @param assignee      Only loads issues where this user is assigned, if specified;
   *                      pass in none for issues with no assigned user, and * for issues assigned to any user
   * @param creator       Only loads issues created by this user, if specified
   * @param mentioned     Only loads issues where this user is mentioned, if specified
   * @param labels        Only loads issues tagged with one of these labels, if specified
   * @param sort          The field to sort by (default created)
   * @param ascending     Whether to sort ascending rather than descending (default false)
   * @param updatedSince  Only issues updated at or after this time are returned
   * @returns             The resulting array of issues
   */
  loadIssuesAsync(
    milestone?: number | "*" | "none",
    state?: "open" | "closed" | "all",
    assignee?: string | "*" | "none",
    creator?: string,
    mentioned?: string,
    labels?: string[],
    sort?: "created" | "updated" | "comments",
    ascending?: boolean,
    updatedSince?: moment.Moment): Promise<Issue[]>;

  /**
   * Loads pull requests for this repository.
   * @param state         Only loads pull requests for this state (default open)
   * @param headBranch    Only loads pull requests where the head to be merged is from this branch
   * @param headUsersFork Only loads pull requests where the head to be merged is from this user's fork
   * @param baseBranch    Only loads pull requests where the base to be merged in to is this branch
   * @param sort          The field to sort by (default created)
   * @param ascending     Whether to sort ascending rather than descending (default false unless sorting by created date)
   * @returns             The resulting array of pull requests
   */
  loadPullRequestsAsync(
    state?: "open" | "closed" | "all",
    headBranch?: string,
    headUsersFork?: string,
    baseBranch?: string,
    sort?: "created" | "updated" | "popularity" | "long-running",
    ascending?: boolean): Promise<PullRequest[]>;
}

export interface Repository extends RepositoryRef {
  owner: UserSummary;

  id: number;
  fullName: string;
  description: string;
  isPrivate: boolean;
  isFork: boolean;
  htmlUri: string;
  homePage: string;
  language?: string;
  forksCount: number;
  starGazersCount: number;
  watchersCount: number;
  size: number;
  defaultBranch: string;
  openIssuesCount: number;
  topics: string[];
  hasIssues: boolean;
  hasWiki: boolean;
  hasPages: boolean;
  hasDownloads: boolean;
  pushed: moment.Moment;
  created: moment.Moment;
  updated: moment.Moment;
  permissions: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
  allowRebasemerge: boolean;
  allowSquashMerge: boolean;
  allowMergeCommit: boolean;
  subscribersCount: number;
  networkCount: number;
}
