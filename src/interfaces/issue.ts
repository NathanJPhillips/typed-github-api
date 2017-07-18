import * as moment from "moment";

import { Label } from "./label";
import { Milestone } from "./milestone";
import { Repository } from "./repository";
import { UserSummary } from "./user";

export interface IssueRef {
  readonly number: number;

  loadAsync(): Promise<Issue | null>;
  loadRepositoryAsync(): Promise<Repository>;
}

export interface Issue extends IssueRef {
  number: number;

  id: number;
  state: "open" | "closed";
  title: string;
  body: string;
  comments: number;
  htmlUri: string;

  createdBy: UserSummary;
  assignee?: UserSummary;
  assignees: UserSummary[];
  labels: Label[];
  milestone?: Milestone;

  created: moment.Moment;
  closed?: moment.Moment;
  closedBy?: UserSummary;
  updated: moment.Moment;

  readonly isOpen: boolean;
  readonly age: moment.Duration;
  wasOpen(when: moment.Moment): boolean;

  locked: boolean;
}
