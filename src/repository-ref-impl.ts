import * as apiTypes from "./api-types";
import { Issue } from "./issue";
import { IssueCreator } from "./pull-request";
import { RepositoryRef } from "./repository-ref";
import { Repository, RepositoryCreator } from "./repository";

declare module "./repository-ref" {
  interface RepositoryRef {
    load(): Promise<Repository | null>;

    loadIssues(
      milestone?: number | "*" | "none"): Promise<Issue[]>;
    loadIssues(
      milestone: number | "*" | "none",
      state: "open" | "closed" | "all",
      assignee?: string | "*" | "none",
      creator?: string,
      mentioned?: string): Promise<Issue[]>;
    loadIssues(
      milestone: number | "*" | "none",
      state: "open" | "closed" | "all",
      assignee: string | "*" | "none",
      creator: string,
      mentioned: string,
      labels: string[],
      sort: "created" | "updated" | "comments",
      ascending: boolean,
      updatedSince?: Date): Promise<Issue[]>;
  }
}

RepositoryRef.prototype.load = async function (this: RepositoryRef): Promise<Repository | null> {
  if (this instanceof Repository)
    return <Repository>this;
  const response = await this.getAsync(`/repos/${this.owner.login}/${this.name}`);
  return RepositoryCreator.create(response, this);
}

RepositoryRef.prototype.loadIssues = async function (
  this: RepositoryRef,
  milestone?: number | "*" | "none",
  state: "open" | "closed" | "all" = "open",
  assignee?: string | "*" | "none",
  creator?: string,
  mentioned?: string,
  labels: string[] = [],
  sort: "created" | "updated" | "comments" = "created",
  ascending: boolean = false,
  updatedSince?: Date): Promise<Issue[]>
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
  const response = await this.getAsync(uri);
  return response.map((issue: apiTypes.Issue) => IssueCreator.create(issue, this));
}
