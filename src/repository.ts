import * as apiTypes from "./api-types";
import { OptionsOrRef } from "./github-ref";
import { RepositoryRef } from "./repository-ref";
import { UserSummary, UserCreator } from "./user";

export class Repository extends RepositoryRef {
  public owner: UserSummary;

  public id: number;
  public fullName: string;
  public description: string;
  public isPrivate: boolean;
  public isFork: boolean;
  public htmlUri: string;
  public homePage: string;
  public language?: string;
  public forksCount: number;
  public starGazersCount: number;
  public watchersCount: number;
  public size: number;
  public defaultBranch: string;
  public openIssuesCount: number;
  public topics: string[];
  public hasIssues: boolean;
  public hasWiki: boolean;
  public hasPages: boolean;
  public hasDownloads: boolean;
  public pushed: Date;
  public created: Date;
  public updated: Date;
  public permissions: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
  public allowRebasemerge: boolean;
  public allowSquashMerge: boolean;
  public allowMergeCommit: boolean;
  public subscribersCount: number;
  public networkCount: number;

  protected constructor(repository: apiTypes.Repository, options: OptionsOrRef) {
    const owner = UserCreator.createSummary(repository.owner, options);
    super(owner, repository.name);
    this.owner = owner;
    this.id = repository.id;
    this.fullName = repository.full_name;
    this.description = repository.description;
    this.isPrivate = repository.private;
    this.isFork = repository.fork;
    this.htmlUri = repository.html_url;
    this.homePage = repository.homepage;
    this.language = repository.language ? repository.language : undefined;
    this.forksCount = repository.forks_count;
    this.starGazersCount = repository.stargazers_count;
    this.watchersCount = repository.watchers_count;
    this.size = repository.size;
    this.defaultBranch = repository.default_branch;
    this.openIssuesCount = repository.open_issues_count;
    this.topics = repository.topics;
    this.hasIssues = repository.has_issues;
    this.hasWiki = repository.has_wiki;
    this.hasPages = repository.has_pages;
    this.hasDownloads = repository.has_downloads;
    this.pushed = repository.pushed_at;
    this.created = repository.created_at;
    this.updated = repository.updated_at;
    this.permissions = repository.permissions;
    this.allowRebasemerge = repository.allow_rebase_merge;
    this.allowSquashMerge = repository.allow_squash_merge;
    this.subscribersCount = repository.subscribers_count;
    this.networkCount = repository.network_count;
  }
}

export class RepositoryCreator extends Repository {
  public static create(data: null, options: OptionsOrRef): null;
  public static create(data: apiTypes.Repository, options: OptionsOrRef): Repository;
  public static create(data: apiTypes.Repository | null, options: OptionsOrRef) {
    if (data === null)
      return null;
    return new Repository(data, options);
  }
}
