import { GitHubRef } from "./github-ref";
import { RepositoryRefClass } from "./repository-ref";

import { Commit, CommitRef, GitCommit } from "./interfaces/commit";


export class CommitRefClass extends GitHubRef implements CommitRef {
  public readonly repository: RepositoryRefClass;
  public readonly sha: string;

  public constructor(repository: RepositoryRefClass, sha: string) {
    super(repository);
    this.repository = repository;
    this.sha = sha;
  }

  public loadAsync(): Promise<Commit | null> {
    throw new Error("Method not implemented.");
  }

  public loadGitAsync(): Promise<GitCommit | null> {
    throw new Error("Method not implemented.");
  }
}
