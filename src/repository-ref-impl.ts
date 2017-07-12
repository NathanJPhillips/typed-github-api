import * as apiTypes from "./api-types";
import { Issue } from "./issue";
import { IssueCreator } from "./pull-request";
import { RepositoryRef } from "./repository-ref";
import { Repository, RepositoryCreator } from "./repository";

declare module "./repository-ref" {
  interface RepositoryRef {
    loadAsync(): Promise<Repository | null>;

    /**
     * @description Loads issues for this repository.
     * @param milestone Only loads issues for this milestone, if specified; specify * to say the issue must be in a milestone and none to say it must not; if a number is passed, it should refer to a milestone by its number field
     * @param state Only loads issues for this state (default open)
     * @param assignee Only loads issues where this user is assigned, if specified; pass in none for issues with no assigned user, and * for issues assigned to any user
     * @param creator Only loads issues created by this user, if specified
     * @param mentioned Only loads issues where this user is mentioned, if specified
     * @param labels Only loads issues tagged with one of these labels, if specified
     * @param sort The field to sort by (default created)
     * @param ascending Whether to sort ascending rather than descending (default false)
     * @param updatedSince Only issues updated at or after this time are returned
     * @return The resulting array of issues
     */
    loadIssuesAsync(
      milestone?: number | "*" | "none",
      state?: "open" | "closed" | "all",
      assignee?: string | "*" | "none",
      creator?: string,
      mentioned?: string,
      labels?: string[],
      sort?: "created" | "updated" | "comments",
      ascending?: boolean,
      updatedSince?: Date): Promise<Issue[]>;
  }
}

RepositoryRef.prototype.loadAsync = async function (this: RepositoryRef): Promise<Repository | null> {
  if (this instanceof Repository)
    return <Repository>this;
  const response = await this.getAsync<apiTypes.Repository>(`/repos/${this.owner.login}/${this.name}`);
  if (response === null)
    return null;
  return RepositoryCreator.create(response.data, this);
}

function loadIssuesAsync(
  milestone?: number | "*" | "none",
  state?: "open" | "closed" | "all",
  assignee?: string | "*" | "none",
  creator?: string,
  mentioned?: string,
  labels?: string[],
  sort?: "created" | "updated" | "comments",
  ascending?: boolean,
  updatedSince?: Date): Promise<Issue[]>;
async function loadIssuesAsync(
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
  const response = await this.getAllPagesAsync<apiTypes.Issue>(uri);
  if (response === null)
    throw new Error("Could not load issues; repository may not exist");
  return response.map((issue) => IssueCreator.create(issue, this));
}
RepositoryRef.prototype.loadIssuesAsync = loadIssuesAsync;
