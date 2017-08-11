import * as moment from "moment";

import * as apiTypes from "./api-types";
import { CommitRefClass } from "./commit-ref";
import { RepositoryRefClass } from "./repository-ref";
import { UserSummaryClass } from "./user";

import { Commit, CommitRef, CommitSummary, GitActor, GitChanges, GitCommit, GitCommitSummary, GitFile } from "./interfaces/commit";
import { UserSummary } from "./interfaces/user";


export class GitCommitSummaryClass extends CommitRefClass implements GitCommitSummary {
  public author: GitActor;
  public committer: GitActor;
  public message: string;

  public constructor(repository: RepositoryRefClass, sha: string, data: apiTypes.GitCommitSummary) {
    super(repository, sha);
    function createActor(actor: apiTypes.GitActor) {
      return {
        name: actor.name,
        email: actor.email,
        date: moment(actor.date),
      };
    }
    this.author = createActor(data.author);
    this.committer = createActor(data.committer);
    this.message = data.message;
  }
}

export class GitCommitClass extends GitCommitSummaryClass implements GitCommit {
  public parents: CommitRef[];

  public constructor(repository: RepositoryRefClass, data: apiTypes.GitCommit) {
    super(repository, data.sha, data);
    this.parents = data.parents.map((cr: apiTypes.CommitRef) => new CommitRefClass(repository, cr.sha));
  }
}

export class CommitSummaryClass extends CommitRefClass implements CommitSummary {
  public htmlUri: string;
  public gitCommit: GitCommitSummary;
  public author?: UserSummary;
  public committer?: UserSummary;
  public parents: CommitRef[];

  public constructor(repository: RepositoryRefClass, data: apiTypes.CommitSummary) {
    super(repository, data.sha);
    this.htmlUri = data.html_url;
    this.gitCommit = new GitCommitSummaryClass(repository, data.sha, data.commit);
    if (data.author)
      this.author = new UserSummaryClass(data.author, this);
    if (data.committer)
      this.committer = new UserSummaryClass(data.committer, this);
    this.parents = data.parents.map((cr: apiTypes.CommitRef) => new CommitRefClass(repository, cr.sha));
  }
}

export class CommitClass extends CommitSummaryClass implements Commit {
  public changes: GitChanges;
  public files: GitFile[];

  public constructor(repository: RepositoryRefClass, data: apiTypes.Commit) {
    super(repository, data);
    this.changes = {
      added: data.stats.additions,
      deleted: data.stats.deletions,
      total: data.stats.total,
    };
    this.files = data.files.map((f) => ({
      filename: f.filename,
      changes: {
        added: f.additions,
        deleted: f.deletions,
        total: f.changes,
      },
      status: f.status,
      patch: f.patch,
    }));
  }
}
