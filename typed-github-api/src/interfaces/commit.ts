import * as moment from "moment";

import { RepositoryRef } from "./repository";
import { UserSummary } from "./user";


export interface CommitRef {
  readonly repository: RepositoryRef;
  readonly sha: string;

  loadAsync(): Promise<Commit | null>;
  loadGitAsync(): Promise<GitCommit | null>;
}

export interface GitActor {
  name: string;
  email: string;
  date: moment.Moment;
}

export interface GitChanges {
  added: number;
  deleted: number;
  total: number;
}

export interface GitFile {
  filename: string;
  changes: GitChanges;
  status: "modified";
  patch: string;
}

export interface GitCommitSummary extends CommitRef {
  author: GitActor;
  committer: GitActor;
  message: string;
}

export interface GitCommit extends CommitRef {
  parents: CommitRef[];
}

export interface CommitSummary extends CommitRef {
  htmlUri: string;
  gitCommit: GitCommitSummary;
  author?: UserSummary;
  committer?: UserSummary;
  parents: CommitRef[];
}

export interface Commit extends CommitSummary {
  changes: GitChanges;
  files: GitFile[];
}
