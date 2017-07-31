import * as moment from "moment";

import * as apiTypes from "./api-types";
import { GitHubRef, OptionsOrRef } from "./github-ref";
import { LabelClass } from "./label";
import { MilestoneClass } from "./milestone";
import { RepositoryClass } from "./repository";
import { UserSummaryClass } from "./user";

import { Issue } from "./interfaces/issue";
import { Label } from "./interfaces/label";
import { Milestone } from "./interfaces/milestone";
import { Repository } from "./interfaces/repository";
import { UserSummary } from "./interfaces/user";


export class IssueClass extends GitHubRef implements Issue {
  private repository: Repository;
  private repositoryUri: string;

  public number: number;

  public id: number;
  public state: "open" | "closed";
  public title: string;
  public body: string;
  public comments: number;
  public htmlUri: string;

  public assignee?: UserSummary;
  public assignees: UserSummary[];
  public labels: Label[];
  public milestone?: Milestone;

  public created: moment.Moment;
  public createdBy: UserSummary;
  public closed?: moment.Moment;
  public closedBy?: UserSummary;
  public updated: moment.Moment;

  public get isOpen(): boolean { return !this.closed; }
  public get age(): moment.Duration { return moment.duration((!this.closed ? moment() : this.closed).diff(this.created)); }
  public wasOpen(when: moment.Moment): boolean {
    return this.created <= when && (!this.closed || this.closed > when);
  }

  public locked: boolean;

  public constructor(data: apiTypes.Issue, options: OptionsOrRef) {
    super(options);
    if (options instanceof RepositoryClass)
      this.repository = options;
    else if (data.repository)
      this.repository = new RepositoryClass(data.repository, options);
    this.repositoryUri = data.repository_url;
    this.number = data.number;
    this.id = data.id;
    this.state = data.state;
    this.title = data.title;
    this.body = data.body;
    this.comments = data.comments;
    this.htmlUri = data.html_url;
    this.createdBy = new UserSummaryClass(data.user, this);
    if (data.assignee)
      this.assignee = new UserSummaryClass(data.assignee, this);
    this.assignees = data.assignees.map((assignee) => new UserSummaryClass(assignee, this));
    this.labels = data.labels.map((label) => new LabelClass(label, this));
    if (data.milestone)
      this.milestone = new MilestoneClass(data.milestone, this);
    this.created = moment(data.created_at);
    if (data.closed_at)
      this.closed = moment(data.closed_at);
    if (data.closed_by)
      this.closedBy = new UserSummaryClass(data.closed_by, this);
    this.updated = moment(data.updated_at);
  }

  public loadAsync(): Promise<Issue | null> {
    return Promise.resolve(this);
  }

  public async loadRepositoryAsync(): Promise<Repository> {
    if (this.repository)
      return this.repository;
    const response = await this.getAsync<apiTypes.Repository>(this.repositoryUri);
    if (response === null)
      throw new Error("Could not load repository for already loaded issue");
    return new RepositoryClass(response.data, this);
  }
}
