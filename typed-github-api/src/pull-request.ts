import * as moment from "moment";

import * as apiTypes from "./api-interfaces";
import { GitHubRef, OptionsOrRef } from "./github-ref";
import { IssueClass, IssueCommentClass } from "./issue";
import { MilestoneClass } from "./milestone";
import { RepositoryClass } from "./repository";
import { UserSummaryClass } from "./user";

import { BranchSummary, BranchSummaryWithRepository } from "./interfaces/branch";
import { Issue } from "./interfaces/issue";
import { Milestone } from "./interfaces/milestone";
import { PullRequest, Review, ReviewComment, ReviewRequests, Team } from "./interfaces/pull-request";
import { UserSummary } from "./interfaces/user";


export class PullRequestClass extends GitHubRef implements PullRequest {
  private issueUri: string;
  private reviewCommentsUri: string;

  public number: number;

  public id: number;
  public title: string;
  public htmlUri: string;
  public createdBy: UserSummary;
  public state: "open" | "closed";
  public locked: boolean;
  public assignee: UserSummary | null;
  public assignees: UserSummary[];
  public milestone: Milestone | null;
  public createdAt: moment.Moment;
  public updatedAt: moment.Moment;
  public mergedAt?: moment.Moment;
  public closedAt?: moment.Moment;
  public body: string;
  public head: BranchSummary;
  public base: BranchSummaryWithRepository;

  public constructor(data: apiTypes.PullRequest, options: OptionsOrRef) {
    super(options);

    this.issueUri = data.issue_url;
    this.reviewCommentsUri = data.review_comments_url;

    this.number = data.number;

    this.id = data.id;
    this.title = data.title;
    this.htmlUri = data.html_url;
    this.createdBy = new UserSummaryClass(data.user, this);
    this.state = data.state;
    this.locked = data.locked;
    if (data.assignee)
      this.assignee = new UserSummaryClass(data.assignee, this);
    this.assignees = data.assignees.map((assignee) => new UserSummaryClass(assignee, this));
    if (data.milestone)
      this.milestone = new MilestoneClass(data.milestone, this);
    this.createdAt = moment(data.created_at);
    this.updatedAt = moment(data.updated_at);
    if (data.merged_at)
      this.mergedAt = moment(data.merged_at);
    if (data.closed_at)
      this.closedAt = moment(data.closed_at);
    this.body = data.body;

    function loadBranchSummary(data: apiTypes.BranchSummary): BranchSummary {
      return {
        name: data.ref,
        sha: data.sha,
        user: new UserSummaryClass(data.user, options),
        repository: data.repo ? new RepositoryClass(data.repo, options) : undefined,
      };
    }
    this.head = loadBranchSummary(data.head);
    if (!data.base.repo)
      throw new Error("no base repo");
    this.base = <BranchSummaryWithRepository>loadBranchSummary(data.base);
  }

  public loadAsync(): Promise<PullRequest | null> {
    return Promise.resolve(this);
  }

  public async loadIssueAsync(): Promise<Issue> {
    const response = await this.getAsync<apiTypes.Issue>(this.issueUri);
    if (response === null)
      throw new Error("Could not load issue for already loaded pull request");
    return new IssueClass(response.data, this);
  }

  public async loadReviewsAsync(): Promise<Review[]> {
    const response = await this.getAsync<apiTypes.Review[]>(
      `/repos/${encodeURIComponent(this.base.repository.owner.login)}/${encodeURIComponent(this.base.repository.name)}/pulls/${this.number}/reviews`);
    if (response === null)
      throw new Error("Could not load reviews for already loaded pull request");
    return response.data.map((review) => new ReviewClass(review, this));
  }

  public async loadReviewCommentsAsync(): Promise<ReviewComment[]> {
    const response = await this.getAsync<apiTypes.ReviewComment[]>(this.reviewCommentsUri);
    if (response === null)
      throw new Error("Could not load review comments for already loaded pull request");
    return response.data.map((comment) => new ReviewCommentClass(comment, this));
  }

  public async loadReviewRequestsAsync(): Promise<ReviewRequests> {
    const response = await this.getPreviewAsync<apiTypes.ReviewRequests>(
      `/repos/${encodeURIComponent(this.base.repository.owner.login)}/${encodeURIComponent(this.base.repository.name)}`
      + `/pulls/${this.number}/requested_reviewers`);
    if (response === null)
      throw new Error("Could not load review comments for already loaded pull request");
    return {
      users: response.data.users.map((user) => new UserSummaryClass(user, this)),
      teams: response.data.teams.map((team) => new TeamClass(team, this)),
    };
  }
}

export class ReviewClass extends GitHubRef implements Review {
  public id: number;
  public createdBy: UserSummary;
  public body: string;
  public commitSha: string;
  public state: "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED";
  public htmlUri: string;

  constructor(data: apiTypes.Review, options: OptionsOrRef) {
    super(options);
    this.id = data.id;
    this.createdBy = new UserSummaryClass(data.user, this);
    this.body = data.body;
    this.commitSha = data.commit_id;
    this.state = data.state;
    this.htmlUri = data.html_url;
  }
}

export class ReviewCommentClass extends IssueCommentClass implements ReviewComment {
  public diffHunk: string;
  public position: number;

  constructor(data: apiTypes.ReviewComment, options: OptionsOrRef) {
    super(data, options);
    this.diffHunk = data.diff_hunk;
    this.position = data.position;
  }
}

export class TeamClass extends GitHubRef implements Team {
  public id: number;
  public name: string;
  public slug: string;
  public description: string;
  public privacy: "closed";
  public permission: "admin";

  constructor(data: apiTypes.Team, options: OptionsOrRef) {
    super(options);
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.privacy = data.privacy;
    this.permission = data.permission;
  }
}
