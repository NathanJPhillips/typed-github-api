import { IssueComment } from "./issue";
import { Label } from "./label";
import { Milestone } from "./milestone";
import { Repository } from "./repository";
import { UserSummary } from "./user";

export interface Issue {
  url: string;
  repository_url: string;
  repository?: Repository;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  number: number;
  title: string;
  user: UserSummary;
  labels: Label[];
  state: "open" | "closed";
  locked: boolean;
  assignee: UserSummary | null;
  assignees: UserSummary[];
  milestone: Milestone | null;
  comments: number;
  created_at: Date;
  updated_at: Date;
  closed_at: Date | null;
  body: string;
  closed_by: UserSummary | null;
  pull_request?: PullRequestExtension;
}

export interface PullRequestExtension {
  url: string;
  html_url: string;
  diff_url: string;
  patch_url: string;
}

export interface IssueComment {
  id: number;
  url: string;
  html_url: string;
  body: string;
  user: UserSummary;
  created_at: Date;
  updated_at: Date;
}
