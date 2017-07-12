import * as apiTypes from "./api-types";
import { GitHubRef, OptionsOrRef } from "./github-ref";
import { Label, LabelCreator } from "./label";
import { Milestone, MilestoneCreator } from "./milestone";
import { UserSummary, UserCreator } from "./user";

export class Issue extends GitHubRef {
  private repositoryUri: string;

  public readonly uri: string;
  public number: number;

  public id: number;
  public state: "open" | "closed";
  public title: string;
  public body: string;
  public comments: number;

  public user: UserSummary;   // Is this createdBy?
  public assignee?: UserSummary;
  public assignees: UserSummary[];
  public labels: Label[];
  public milestone?: Milestone;

  public created: Date;
  public closed?: Date;
  public closedBy?: UserSummary;
  public updated: Date;

  public get isOpen() { return !this.closed; }
  public get age() { return (!this.closed ? Date.now() : this.closed.getTime()) - this.created.getTime(); }
  public wasOpenAtDate(when: Date) {
    return this.created <= when && (!this.closed || this.closed > when);
  };

  public locked: boolean;

  protected constructor(data: apiTypes.Issue, options: OptionsOrRef) {
    super(options);
    this.repositoryUri = data.repository_url;
    this.uri = data.url;
    this.number = data.number;
    this.id = data.id;
    this.state = data.state;
    this.title = data.title;
    this.body = data.body;
    this.comments = data.comments;
    this.user = UserCreator.createSummary(data.user, this);
    if (data.assignee)
      this.assignee = UserCreator.createSummary(data.assignee, this);
    this.assignees = data.assignees.map((assignee) => UserCreator.createSummary(assignee, this));
    this.labels = data.labels.map((label) => LabelCreator.create(label, this));
    if (data.milestone)
      this.milestone = MilestoneCreator.create(data.milestone, this);
    this.created = data.created_at; // TODO: May need new Date(...)
    this.closed = data.closed_at || undefined;
    if (data.closed_by)
      this.closedBy = UserCreator.createSummary(data.closed_by, this);
    this.updated = data.updated_at;
  }
}
