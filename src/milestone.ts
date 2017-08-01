import * as moment from "moment";

import * as apiTypes from "./api-types";
import { GitHubRef, OptionsOrRef } from "./github-ref";
import { UserSummaryClass } from "./user";

import { Milestone } from "./interfaces/milestone";
import { UserSummary } from "./interfaces/user";


export class MilestoneClass extends GitHubRef implements Milestone {
  public id: number;
  public number: number;
  public title: string;
  public description: string;
  public creator: UserSummary;
  public openIssueCount: number;
  public closedIssueCount: number;
  public state: "open" | "closed";
  public created: moment.Moment;
  public updated: moment.Moment;
  public due: moment.Moment;
  public closed?: moment.Moment;

  public constructor(data: apiTypes.Milestone, options: OptionsOrRef) {
    super(options);
    this.id = data.id;
    this.number = data.number;
    this.title = data.title;
    this.description = data.description;
    this.creator = new UserSummaryClass(data.creator, this);
    this.openIssueCount = data.open_issues;
    this.closedIssueCount = data.closed_issues;
    this.state = data.state;
    this.created = moment(data.created_at);
    this.updated = moment(data.updated_at);
    this.due = moment(data.due_on);
    if (data.closed_at)
      this.closed = moment(data.closed_at);
  }
}
