import * as moment from "moment";

import * as apiTypes from "./api-types";
import { createIssue } from "./pull-request";
import { RepositoryClass } from "./repository";
import { RepositoryRefClass } from "./repository-ref";

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
