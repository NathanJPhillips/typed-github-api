import * as apiTypes from "./api-types";
import { GitHubRef, OptionsOrRef } from "./github-ref";
import { Issue } from "./issue";
import { IssueCreator } from "./pull-request";
import { OrganizationRef, OrganizationRefCreator } from "./organization-ref";
import { UserRef, UserRefCreator } from "./user-ref";
import { Repository, RepositoryCreator } from "./repository";


export interface SearchResult<T> {
  result: T;
  score: number;
}

export class GitHubApi extends GitHubRef {
  public constructor(options: OptionsOrRef) {
    super(options);
  }

  public getUser(login: string): UserRef {
    return UserRefCreator.create(login, this);
  }

  public getOrganization(login: string): OrganizationRef {
    return OrganizationRefCreator.create(login, this);
  }

  public async loadMyRepositories(
    visibility: "all" | "public" | "private",
    affiliation: ("owner" | "collaborator" | "organization_member")[] = ["owner", "collaborator", "organization_member"],
    sort: "created" | "updated" | "pushed" | "full_name" = "full_name",
    ascending?: boolean): Promise<Repository[]>
  {
    if (ascending === undefined)
      ascending = sort === "full_name";
    const response = await this.getAsync(`/user/repos?visibility=${visibility}&affiliation=${affiliation.join(",")}&sort=${sort}&direction=${ascending ? "asc" : "desc"}`);
    return response.map(this.getRepository);
  }

  public async loadIssues(
    filter: "assigned" | "created" | "mentioned" | "subscribed" | "all" = "assigned",
    state: "open" | "closed" | "all" = "open",
    labels: string[] = [],
    sort: "created" | "updated" | "comments" = "created",
    ascending: boolean = false,
    updatedSince?: Date): Promise<Issue[]>
  {
    await this.getAsync("/issues");
    let uri = `/issues?filter=${filter}&state=${state}&labels=${labels.join(",")}&sort=${sort}&direction=${ascending ? "asc" : "desc"}`;
    if (updatedSince)
      uri += `&since=${updatedSince.toISOString()}`;
    const response = await this.getAsync(uri);
    return response.map(this.getIssue);
  }

  private async search<TData, TApiData>(
    uri: string,
    query: string,
    sort: string,
    ascending: boolean,
    perPage: number,
    mapping: (item: TApiData & apiTypes.SearchResult) => TData): Promise<TData[]>
  {
    uri += `?q=${encodeURIComponent(query)}`;
    if (sort !== "best match")
      uri += `&sort=${sort}&order=${ascending ? "asc" : "desc"}`;
    uri += `&per_page=${perPage}`;
    const result: apiTypes.SearchResults = await this.getAsync(uri);
    return result.items.map(mapping);
  }

  /**
   * @description Loads repositories matching search query.
   * @param query The query used for the search
   * @param sort The field to sort by (default best match)
   * @param ascending If a field to sort by is specified, whether to sort ascending rather than descending (default false)
   * @param perPage How many results to return per page (default 100) - pages are concatentated to produce the results array
   * @return An array of repositories that match the query
   */
  public searchRepositories(
    query: string,
    sort: "stars" | "forks" | "updated" | "best match" = "best match",
    ascending: boolean = false,
    perPage: number = 100): Promise<Repository[]>
  {
    return this.search("/search/repositories", query, sort, ascending, perPage, this.getRepository);
  }

  /**
   * @description Loads repositories matching search query with a score as to how well they matched.
   * @param query The query used for the search
   * @param sort The field to sort by (default best match)
   * @param ascending If a field to sort by is specified, whether to sort ascending rather than descending (default false)
   * @param perPage How many results to return per page (default 100) - pages are concatentated to produce the results array
   * @return An array of repositories that match the query with a score as to how well they matched
   */
  public searchRepositoriesWithScore(
    query: string,
    sort: "stars" | "forks" | "updated" | "best match" = "best match",
    ascending: boolean = false,
    perPage: number = 100): Promise<SearchResult<Repository>[]>
  {
    const mapping = (repo: apiTypes.Repository & apiTypes.SearchResult) => ({
      result: this.getRepository(repo),
      score: repo.score,
    });
    return this.search("/search/repositories", query, sort, ascending, perPage, mapping);
  }

  /**
   * @description Loads issues matching search query.
   * @param query The query used for the search
   * @param sort The field to sort by (default best match)
   * @param ascending If a field to sort by is specified, whether to sort ascending rather than descending (default false)
   * @param perPage How many results to return per page (default 100) - pages are concatentated to produce the results array
   * @return An array of issues that match the query
   */
  public async searchIssues(
    query: string,
    sort: "comments" | "created" | "updated" | "best match" = "best match",
    ascending: boolean = false,
    perPage: number = 100): Promise<Issue[]>
  {
    return this.search("/search/issues", query, sort, ascending, perPage, this.getIssue);
  }

  /**
   * @description Loads issues matching search query with a score as to how well they matched.
   * @param query The query used for the search
   * @param sort The field to sort by (default best match)
   * @param ascending If a field to sort by is specified, whether to sort ascending rather than descending (default false)
   * @param perPage How many results to return per page (default 100) - pages are concatentated to produce the results array
   * @return An array of issues that match the query with a score as to how well they matched
   */
  public async searchIssuesWithScore(
    query: string,
    sort: "comments" | "created" | "updated" | "best match" = "best match",
    ascending: boolean = false,
    perPage: number = 100): Promise<SearchResult<Issue>[]>
  {
    const mapping = (issue: apiTypes.Issue & apiTypes.SearchResult) => ({
      result: this.getIssue(issue),
      score: issue.score,
    });
    return this.search("/search/issues", query, sort, ascending, perPage, mapping);
  }

  private getRepository(repository: apiTypes.Repository) { return RepositoryCreator.create(repository, this); }
  private getIssue(issue: apiTypes.Issue) { return IssueCreator.create(issue, this); }
}
