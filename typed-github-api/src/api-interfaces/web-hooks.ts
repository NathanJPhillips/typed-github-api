import { Issue } from "./issue";
import { Label } from "./label";
import { Repository } from "./repository";
import { OrganizationSummary, UserSummary } from "./user";

export interface Event {
  action: string;
}

export interface IssueEvent extends Event {
  action: "assigned" | "unassigned" | "labeled" | "unlabeled" | "opened" | "edited" | "milestoned" | "demilestoned" | "closed" | "reopened";
  issue: Issue;
}

export interface IssueAssignedEvent extends IssueEvent {
  action: "assigned" | "unassigned";
  assignee: UserSummary;
}

export interface IssueLabeledEvent extends IssueEvent {
  action: "labeled" | "unlabeled";
  label: Label;
}

export interface IssueEditedEvent extends IssueEvent {
  action: "edited";
  changes: {
    title: {
      from: string;
    };
    body: {
      from: string;
    };
  };
}

export interface WebHookData extends Event {
  sender: UserSummary;
  organization?: OrganizationSummary;
  repository?: Repository;
}

export interface IssueWebHookData extends IssueEvent, WebHookData {
  action: "assigned" | "unassigned" | "labeled" | "unlabeled" | "opened" | "edited" | "milestoned" | "demilestoned" | "closed" | "reopened";
}
