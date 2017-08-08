import * as moment from "moment";

import { Issue, IssueComment } from "./issue";
import { Milestone } from "./milestone";
import { Repository } from "./repository";
import { UserSummary } from "./user";

export interface PullRequestRef {
  readonly number: number;

  loadAsync(): Promise<PullRequest | null>;
}

export interface PullRequest extends PullRequestRef {
  id: number;
  number: number;
  title: string;
  htmlUri: string;
  createdBy: UserSummary;
  state: "open" | "closed";
  locked: boolean;
  assignee: UserSummary | null;
  assignees: UserSummary[];
  milestone: Milestone | null;
  createdAt: moment.Moment;
  updatedAt: moment.Moment;
  mergedAt?: moment.Moment;
  closedAt?: moment.Moment;
  body: string;
  head: Branch;
  base: BranchWithRepo;

  loadIssueAsync(): Promise<Issue>;
  loadReviewsAsync(): Promise<Review[]>;
  loadReviewCommentsAsync(): Promise<ReviewComment[]>;
  loadReviewRequestsIncludingTeamsPreviewAsync(): Promise<ReviewRequests>;
  loadReviewRequestsAsync(): Promise<UserSummary[]>;
}

export interface Branch {
  name: string;
  sha: string;
  user: UserSummary;
  repository?: Repository;
}

export interface BranchWithRepo extends Branch {
  repository: Repository;
}

export interface Review {
  id: number;
  createdBy: UserSummary;
  body: string;
  commitSha: string;
  state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED";
  htmlUri: string;
}

export interface ReviewComment extends IssueComment {
  diffHunk: string;
  position: number;
}

export interface ReviewRequests {
  users: UserSummary[];
  teams: Team[];
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  description: string;
  privacy: "closed";
  permission: "admin";
}
