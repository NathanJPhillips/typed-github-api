import * as moment from "moment";

import * as apiTypes from "./api-types";
import { CommitSummaryClass } from "./commit";
import { createIssue } from "./pull-request";
import { RepositoryClass } from "./repository";
import { RepositoryRefClass } from "./repository-ref";

import { CommitSummary } from "./interfaces/commit";
import { Issue } from "./interfaces/issue";
import { Repository } from "./interfaces/repository";


RepositoryRefClass.prototype.loadAsync = async function (this: RepositoryRefClass): Promise<Repository | null> {
  if (this instanceof RepositoryClass)
    return <RepositoryClass>this;
  const response = await this.getAsync<apiTypes.Repository>(`/repos/${this.owner.login}/${this.name}`);
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
  let uri = `/repos/${this.owner.login}/${this.name}/commits?`;
  uri += `sha=${start}`;
  if (pathIncluded)
    uri += `&path=${pathIncluded}`;
  if (author)
    uri += `&author=${author}`;
  if (since)
    uri += `&since=${since}`;
  if (until)
    uri += `&until=${until}`;
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
  let uri = `/repos/${this.owner.login}/${this.name}/issues?`;
  if (milestone)
    uri += `milestone=${milestone}&`;
  uri += `state=${state}&`;
  if (assignee)
    uri += `assignee=${assignee}&`;
  if (creator)
    uri += `creator=${creator}&`;
  if (mentioned)
    uri += `mentioned=${mentioned}&`;
  if (labels.length !== 0)
    uri += `labels=${labels.join(",")}&`;
  uri += `sort=${sort}&direction=${ascending ? "asc" : "desc"}`;
  if (updatedSince)
    uri += `&since=${updatedSince.toISOString()}`;
  const response = await this.getAllPagesAsync<apiTypes.Issue>(uri);
  if (response === null)
    throw new Error("Could not load issues; repository may not exist");
  return response.map((issue) => createIssue(issue, this));
}
RepositoryRefClass.prototype.loadIssuesAsync = loadIssuesAsync;
