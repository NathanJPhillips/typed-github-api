import * as moment from "moment";

import * as apiTypes from "./api-interfaces";
import { CommitSummaryClass } from "./commit";
import { IssueClass } from "./issue";
import { PullRequestClass } from "./pull-request";
import { RepositoryClass } from "./repository";
import { RepositoryRefClass } from "./repository-ref";

import { CommitSummary } from "./interfaces/commit";
import { Issue } from "./interfaces/issue";
import { PullRequest } from "./interfaces/pull-request";
import { Repository } from "./interfaces/repository";


RepositoryRefClass.prototype.loadAsync = async function (this: RepositoryRefClass): Promise<Repository | null> {
  if (this instanceof RepositoryClass)
    return <RepositoryClass>this;
  const response = await this.getAsync<apiTypes.Repository>(`/repos/${encodeURIComponent(this.owner.login)}/${encodeURIComponent(this.name)}`);
  if (response === null)
    return null;
  return new RepositoryClass(response.data, this);
};

async function loadCommitsAsync(
  this: RepositoryRefClass,
  start: string = "master",
  pathIncluded?: string,
  author?: string,
  since?: moment.Moment,
  until?: moment.Moment): Promise<CommitSummary[]>
{
  let uri = `/repos/${encodeURIComponent(this.owner.login)}/${encodeURIComponent(this.name)}/commits?`;
  uri += `sha=${encodeURIComponent(start)}`;
  if (pathIncluded)
    uri += `&path=${encodeURIComponent(pathIncluded)}`;
  if (author)
    uri += `&author=${encodeURIComponent(author)}`;
  if (since)
    uri += `&since=${since.toISOString()}`;
  if (until)
    uri += `&until=${until.toISOString()}`;
  const response = await this.getAllPagesAsync<apiTypes.CommitSummary>(uri);
  if (response === null)
    throw new Error("Could not load commits; repository may not exist");
  return response.map((commit) => new CommitSummaryClass(this, commit));
}
RepositoryRefClass.prototype.loadCommitsAsync = loadCommitsAsync;

function loadIssuesAsync(
  milestone?: number | "*" | "none",
  state?: "open" | "closed" | "all",
  assignee?: string | "*" | "none",
  creator?: string,
  mentioned?: string,
  labels?: string[],
  sort?: "created" | "updated" | "comments",
  ascending?: boolean,
  updatedSince?: moment.Moment): Promise<Issue[]>;
async function loadIssuesAsync(
  this: RepositoryRefClass,
  milestone?: number | "*" | "none",
  state: "open" | "closed" | "all" = "open",
  assignee?: string | "*" | "none",
  creator?: string,
  mentioned?: string,
  labels: string[] = [],
  sort: "created" | "updated" | "comments" = "created",
  ascending: boolean = false,
  updatedSince?: moment.Moment): Promise<Issue[]>
{
  let uri = `/repos/${encodeURIComponent(this.owner.login)}/${encodeURIComponent(this.name)}/issues?`;
  if (milestone)
    uri += `milestone=${milestone}&`;
  uri += `state=${state}&`;
  if (assignee)
    uri += `assignee=${encodeURIComponent(assignee)}&`;
  if (creator)
    uri += `creator=${encodeURIComponent(creator)}&`;
  if (mentioned)
    uri += `mentioned=${encodeURIComponent(mentioned)}&`;
  if (labels.length !== 0)
    uri += `labels=${labels.map(encodeURIComponent).join(",")}&`;
  uri += `sort=${sort}&direction=${ascending ? "asc" : "desc"}`;
  if (updatedSince)
    uri += `&since=${updatedSince.toISOString()}`;
  const response = await this.getAllPagesAsync<apiTypes.Issue>(uri);
  if (response === null)
    throw new Error("Could not load issues; repository may not exist");
  return response.map((issue) => new IssueClass(issue, this));
}
RepositoryRefClass.prototype.loadIssuesAsync = loadIssuesAsync;

function loadPullRequestsAsync(
  state?: "open" | "closed" | "all",
  headBranch?: string,
  headUsersFork?: string,
  baseBranch?: string,
  sort?: "created" | "updated" | "popularity" | "long-running",
  ascending?: boolean): Promise<PullRequest[]>;
async function loadPullRequestsAsync(
  this: RepositoryRefClass,
  state: "open" | "closed" | "all" = "open",
  headBranch?: string,
  headUsersFork?: string,
  baseBranch?: string,
  sort: "created" | "updated" | "popularity" | "long-running" = "created",
  ascending?: boolean): Promise<PullRequest[]>
{
  let uri = `/repos/${encodeURIComponent(this.owner.login)}/${encodeURIComponent(this.name)}/pulls?`;
  uri += `state=${state}&`;
  if (headBranch)
    uri += `head=${headUsersFork ? encodeURIComponent(headUsersFork) : ""}:${encodeURIComponent(headBranch)}&`;
  if (baseBranch)
    uri += `base=${encodeURIComponent(baseBranch)}&`;
  if (ascending === undefined)
    ascending = sort !== "created";
  uri += `sort=${sort}&direction=${ascending ? "asc" : "desc"}`;
  const response = await this.getAllPagesAsync<apiTypes.PullRequest>(uri);
  if (response === null)
    throw new Error("Could not load pull requests; repository may not exist");
  return response.map((pullRequest) => new PullRequestClass(pullRequest, this));
}
RepositoryRefClass.prototype.loadPullRequestsAsync = loadPullRequestsAsync;
