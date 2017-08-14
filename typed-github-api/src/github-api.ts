import * as moment from "moment";

import * as apiTypes from "./api-interfaces";
import { GitHubRef, OptionsOrRef } from "./github-ref";
import { IssueClass } from "./issue";
import { OrganizationSummaryClass } from "./organization";
import { OwnerRefClass } from "./owner-ref";
import { RepositoryClass } from "./repository";

import { Issue } from "./interfaces/issue";
import { OwnerRef } from "./interfaces/owner-ref";
import { Repository } from "./interfaces/repository";


export interface SearchResult<T> {
  result: T;
  score: number;
}

export class GitHubApi extends GitHubRef {
  public constructor(options: OptionsOrRef) {
    super(options);
  }

  public getOwner(login: string): OwnerRef {
    return new OwnerRefClass(login, this);
  }

  /**
   * @deprecated Use getOwner instead
   */
  public getUser(login: string): OwnerRefClass {
    return new OwnerRefClass(login, this);
  }

  /**
   * @deprecated Use getOwner instead
   */
  public getOrganization(login: string): OwnerRefClass {
    return new OwnerRefClass(login, this);
  }

  public async loadMyRepositoriesAsync(
    visibility: "all" | "public" | "private",
    affiliation: Array<"owner" | "collaborator" | "organization_member"> = ["owner", "collaborator", "organization_member"],
    sort: "created" | "updated" | "pushed" | "full_name" = "full_name",
    ascending?: boolean): Promise<Repository[]>
  {
    if (ascending === undefined)
      ascending = sort === "full_name";
    const response = await this.getAllPagesAsync<apiTypes.Repository>(
      `/user/repos?visibility=${visibility}&affiliation=${affiliation.join(",")}&sort=${sort}&direction=${ascending ? "asc" : "desc"}`);
    if (response === null)
      throw new Error("Couldn't retrieve the current user's repositories");
    return response.map(this.getRepository);
  }

  public async loadMyOrganizationsAsync() {
    const response = await this.getAllPagesAsync<apiTypes.OrganizationSummary>("/user/orgs");
    if (response === null)
      throw new Error("Couldn't retrieve the current user's organizations");
    return response.map((org) => new OrganizationSummaryClass(org, this));
  }

  public async loadIssuesAsync(
    filter: "assigned" | "created" | "mentioned" | "subscribed" | "all" = "assigned",
    state: "open" | "closed" | "all" = "open",
    labels: string[] = [],
    sort: "created" | "updated" | "comments" = "created",
    ascending: boolean = false,
    updatedSince?: moment.Moment): Promise<Issue[]>
  {
    let uri = "/issues";
    uri += `?filter=${filter}&state=${state}&labels=${labels.map(encodeURIComponent).join(",")}`;
    uri += `&sort=${sort}&direction=${ascending ? "asc" : "desc"}`;
    if (updatedSince)
      uri += `&since=${updatedSince.toISOString()}`;
    const response = await this.getAllPagesAsync<apiTypes.Issue>(uri);
    if (response === null)
      throw new Error("Couldn't retrieve the current user's issues");
    return response.map(this.getIssue);
  }

  private async getAllSearchPagesAsync<TApiData>(uri: string): Promise<Array<TApiData & apiTypes.SearchResult>> {
    const response = await this.getAsync<apiTypes.SearchResults<TApiData>>(uri);
    if (response === null)
      throw new Error("Couldn't retrieve first search results page");
    if (!response.nextLink)
      return response.data.items;
    const remainingResponse = await this.getAllSearchPagesAsync<TApiData>(response.nextLink);
    return response.data.items.concat(remainingResponse);
  }

  private async searchAsync<TData, TApiData>(
    uri: string,
    query: string,
    sort: string,
    ascending: boolean,
    perPage: number,
    mapping: (item: TApiData & apiTypes.SearchResult) => TData): Promise<TData[]>
  {
    uri += `?q=${encodeURIComponent(query)}`;
    if (sort !== "best match")
      uri += `&sort=${encodeURIComponent(sort)}&order=${ascending ? "asc" : "desc"}`;
    uri += `&per_page=${perPage}`;
    const result = await this.getAllSearchPagesAsync(uri);
    return result.map(mapping);
  }

  /**
   * Loads repositories matching search query.
   * @param query     The query used for the search
   * @param sort      The field to sort by (default best match)
   * @param ascending If a field to sort by is specified, whether to sort ascending rather than descending (default false)
   * @param perPage   How many results to return per page (default 100) - pages are concatentated to produce the results array
   * @returns         An array of repositories that match the query
   */
  public searchRepositoriesAsync(
    query: string,
    sort: "stars" | "forks" | "updated" | "best match" = "best match",
    ascending: boolean = false,
    perPage: number = 100): Promise<Repository[]>
  {
    return this.searchAsync("/search/repositories", query, sort, ascending, perPage, this.getRepository);
  }

  /**
   * Loads repositories matching search query with a score as to how well they matched.
   * @param query     The query used for the search
   * @param sort      The field to sort by (default best match)
   * @param ascending If a field to sort by is specified, whether to sort ascending rather than descending (default false)
   * @param perPage   How many results to return per page (default 100) - pages are concatentated to produce the results array
   * @returns         An array of repositories that match the query with a score as to how well they matched
   */
  public searchRepositoriesWithScoreAsync(
    query: string,
    sort: "stars" | "forks" | "updated" | "best match" = "best match",
    ascending: boolean = false,
    perPage: number = 100): Promise<Array<SearchResult<Repository>>>
  {
    const mapping = (repo: apiTypes.Repository & apiTypes.SearchResult) => ({
      result: this.getRepository(repo),
      score: repo.score,
    });
    return this.searchAsync("/search/repositories", query, sort, ascending, perPage, mapping);
  }

  /**
   * Loads issues matching search query.
   * @param query     The query used for the search
   * @param sort      The field to sort by (default best match)
   * @param ascending If a field to sort by is specified, whether to sort ascending rather than descending (default false)
   * @param perPage   How many results to return per page (default 100) - pages are concatentated to produce the results array
   * @returns         An array of issues that match the query
   */
  public async searchIssuesAsync(
    query: string,
    sort: "comments" | "created" | "updated" | "best match" = "best match",
    ascending: boolean = false,
    perPage: number = 100): Promise<Issue[]>
  {
    return this.searchAsync("/search/issues", query, sort, ascending, perPage, this.getIssue);
  }

  /**
   * Loads issues matching search query with a score as to how well they matched.
   * @param query     The query used for the search
   * @param sort      The field to sort by (default best match)
   * @param ascending If a field to sort by is specified, whether to sort ascending rather than descending (default false)
   * @param perPage   How many results to return per page (default 100) - pages are concatentated to produce the results array
   * @returns         An array of issues that match the query with a score as to how well they matched
   */
  public async searchIssuesWithScoreAsync(
    query: string,
    sort: "comments" | "created" | "updated" | "best match" = "best match",
    ascending: boolean = false,
    perPage: number = 100): Promise<Array<SearchResult<Issue>>>
  {
    const mapping = (issue: apiTypes.Issue & apiTypes.SearchResult) => ({
      result: this.getIssue(issue),
      score: issue.score,
    });
    return this.searchAsync("/search/issues", query, sort, ascending, perPage, mapping);
  }

  private getRepository(repository: apiTypes.Repository) { return new RepositoryClass(repository, this); }
  private getIssue(issue: apiTypes.Issue) { return new IssueClass(issue, this); }
}
