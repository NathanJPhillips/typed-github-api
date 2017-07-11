import * as apiTypes from "./api-types";
import { OptionsOrRef } from "./github-ref";
import { UserSummary, UserCreator } from "./user";

export class Milestone {
  public id: number;
  public number: number;
  public title: string;
  public description: string;
  public creator: UserSummary;
  public openIssueCount: number;
  public closedIssueCount: number;
  public state: "open" | "closed";
  public created: Date;
  public updated: Date;
  public due: Date;
  public closed?: Date;

  protected constructor(data: apiTypes.Milestone, options: OptionsOrRef) {
    this.id = data.id;
    this.number = data.number;
    this.title = data.title;
    this.description = data.description;
    this.creator = UserCreator.createSummary(data.creator, options);
    this.openIssueCount = data.open_issues;
    this.closedIssueCount = data.closed_issues;
    this.state = data.state;
    this.created = data.created_at;
    this.updated = data.updated_at;
    this.due = data.due_on;
    this.closed = data.closed_at || undefined;
  }
}

export class MilestoneCreator extends Milestone {
  public static create(data: null, options: OptionsOrRef): null;
  public static create(data: apiTypes.Milestone, options: OptionsOrRef): Milestone;
  public static create(data: apiTypes.Milestone | null, options: OptionsOrRef) {
    if (data === null)
      return null;
    return new Milestone(data, options);
  }
}
