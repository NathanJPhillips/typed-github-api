import { BranchSummary } from "./branch";
import { IssueComment } from "./issue";
import { Milestone } from "./milestone";
import { Team } from "./team";
import { UserSummary } from "./user";

export interface PullRequest {
  url: string;
  comments_url: string;
  html_url: string;
  id: number;
  number: number;
  title: string;
  user: UserSummary;
  state: "open" | "closed";
  locked: boolean;
  assignee: UserSummary | null;
  assignees: UserSummary[];
  milestone: Milestone | null;
  created_at: Date;
  updated_at: Date;
  closed_at: Date | null;
  body: string;
  issue_url: string;
  commits_url: string;
  review_comments_url: string;
  review_comment_url: string;
  statuses_url: string;
  merged_at: Date | null;
  head: BranchSummary;
  base: BranchSummary;
}

export interface Review {
  id: number;
  user: UserSummary;
  body: string;
  commit_id: string;
  state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED";
  html_url: string;
  pull_request_url: string;
}

export interface ReviewComment extends IssueComment {
  pull_request_review_id: number;
  diff_hunk: string;
  path: string;
  position: number;
  original_position: number;
  commit_id: string;
  original_commit_id: string;
  pull_request_url: string;
}

export interface ReviewRequests {
  users: UserSummary[];
  teams: Team[];
}
