import { UserSummary } from "./user";

export interface GitActor {
  name: string;
  email: string;
  date: Date;
}

export interface GitRef {
  url: string;
  sha: string;
}

export interface CommitRef extends GitRef {
  html_url: string;
}

export interface GitCommitSummary {
  url: string;
  author: GitActor;
  committer: GitActor;
  message: string;
  tree: GitRef;
  comment_count: number;
  verification?: {
    verified: boolean;
    reason: "valid";
    signature: string;
    payload: string;
  };
}

export interface GitCommit extends GitCommitSummary {
  sha: string;
  html_url: string;
  parents: CommitRef[];
}

export interface CommitSummary {
  url: string;
  sha: string;
  html_url: string;
  comments_url: string;
  commit: GitCommitSummary;
  author: UserSummary;
  committer: UserSummary;
  parents: CommitRef[];
}

export interface Commit extends CommitSummary {
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
  files: [
    {
      filename: string;
      additions: number;
      deletions: number;
      changes: number;
      status: "modified";
      raw_url: string;
      blob_url: string;
      patch: string;
    }
  ];
}
