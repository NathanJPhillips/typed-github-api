import * as apiTypes from "./api-interfaces";
import { CommitClass, GitCommitClass } from "./commit";
import { CommitRefClass } from "./commit-ref";

import { Commit, GitCommit } from "./interfaces/commit";


CommitRefClass.prototype.loadAsync = async function (this: CommitRefClass): Promise<Commit | null> {
  if (this instanceof CommitClass)
    return <CommitClass>this;
  const response = await this.getAsync<apiTypes.Commit>(
    `/repos/${encodeURIComponent(this.repository.owner.login)}/${encodeURIComponent(this.repository.name)}/commits/${encodeURIComponent(this.sha)}`);
  if (response === null)
    return null;
  return new CommitClass(this.repository, response.data);
};

CommitRefClass.prototype.loadGitAsync = async function (this: CommitRefClass): Promise<GitCommit | null> {
  if (this instanceof GitCommitClass)
    return <GitCommitClass>this;
  const response = await this.getAsync<apiTypes.GitCommit>(
    `/repos/${encodeURIComponent(this.repository.owner.login)}/${encodeURIComponent(this.repository.name)}/git/commits/${encodeURIComponent(this.sha)}`);   // tslint:disable-line: max-line-length
  if (response === null)
    return null;
  return new GitCommitClass(this.repository, response.data);
};
