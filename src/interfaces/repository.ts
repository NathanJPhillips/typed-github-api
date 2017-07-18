import * as moment from "moment";

import { CommitRef, CommitSummary } from "./commit";
import { Issue, IssueRef } from "./issue";
import { OrganizationRef } from "./organization";
import { UserRef, UserSummary } from "./user";

export interface RepositoryRef {
  readonly owner: UserRef | OrganizationRef;
  readonly name: string;

  getCommit(sha: string): CommitRef;
  getIssue(issueNumber: number): IssueRef;

  loadAsync(): Promise<Repository | null>;

  /**
   * @description Loads commits from this repository.
   * @param start: string SHA or branch to start listing commits from. Default: the repository’s default branch (usually master)
   * @param pathIncluded Only commits containing this file path will be returned
   * @param author GitHub login or email address by which to filter by commit author
   * @param since Only commits after this date will be returned
   * @param until Only commits before this date will be returned
   * @returns The resulting array of commits
   */
  loadCommitsAsync(
    start?: string,
    pathIncluded?: string,
    author?: string,
    since?: moment.Moment,
    until?: moment.Moment): Promise<CommitSummary[]>;
  /**
   * @description Loads issues for this repository.
   * @param milestone Only loads issues for this milestone, if specified; specify * to say the issue must be in a milestone and none to say it must not; if a number is passed, it should refer to a milestone by its number field
   * @param state Only loads issues for this state (default open)
   * @param assignee Only loads issues where this user is assigned, if specified; pass in none for issues with no assigned user, and * for issues assigned to any user
   * @param creator Only loads issues created by this user, if specified
   * @param mentioned Only loads issues where this user is mentioned, if specified
   * @param labels Only loads issues tagged with one of these labels, if specified
   * @param sort The field to sort by (default created)
   * @param ascending Whether to sort ascending rather than descending (default false)
   * @param updatedSince Only issues updated at or after this time are returned
   * @returns The resulting array of issues
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
